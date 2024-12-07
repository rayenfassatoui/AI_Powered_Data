import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { parse } from 'json2csv';
import { createChartConfig, generateChartImage } from '@/utils/chartGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    const report = await prisma.report.findFirst({
      where: {
        id: id as string,
        user: {
          email: session.user.email
        }
      },
      include: {
        dataset: true
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    switch (report.exportFormat) {
      case 'pdf':
        await generatePDF(report, res);
        break;
      case 'excel':
        await generateExcel(report, res);
        break;
      case 'csv':
        await generateCSV(report, res);
        break;
      default:
        await generatePDF(report, res);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ message: 'Error generating report' });
  }
}

async function generatePDF(report: any, res: NextApiResponse) {
  const doc = new PDFDocument({ size: report.orientation === 'landscape' ? 'letter-landscape' : 'letter' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${report.name}.pdf`);
  doc.pipe(res);

  // Title and basic info
  doc.fontSize(24).text(report.name, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
  doc.moveDown(2);

  // Add metrics section if metrics are included
  if (report.metrics && report.metrics.length > 0) {
    doc.fontSize(18).text('Key Metrics', { underline: true });
    doc.moveDown();

    for (const metric of report.metrics) {
      const formattedName = formatMetricName(metric.type);
      const formattedValue = formatMetricValue(metric.value);
      doc.fontSize(14).text(`${formattedName}: ${formattedValue}`);
      doc.moveDown();
    }
    doc.moveDown();
  }

  // Generate and add visualizations
  if (report.visualizations && report.visualizations.length > 0) {
    doc.fontSize(18).text('Visualizations', { underline: true });
    doc.moveDown();

    for (const viz of report.visualizations) {
      try {
        // Create chart configuration based on dataset
        const chartConfig = createChartConfig({
          type: viz.type,
          data: report.dataset.data,
          label: viz.label || 'Value',
          xAxisLabel: viz.xAxisLabel || 'Category',
          yAxisLabel: viz.yAxisLabel || 'Value',
          options: viz.options || {}
        });

        // Generate chart image
        const chartImage = await generateChartImage(chartConfig);

        // Add chart title
        doc.fontSize(14).text(viz.label || formatChartName(viz.type));
        doc.moveDown(0.5);

        // Calculate image dimensions while maintaining aspect ratio
        const maxWidth = doc.page.width - 100; // Margins on both sides
        const maxHeight = 300;
        const imgAspectRatio = 800 / 400; // Original chart dimensions
        
        let imgWidth = maxWidth;
        let imgHeight = imgWidth / imgAspectRatio;
        
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * imgAspectRatio;
        }

        // Add chart image
        doc.image(chartImage, {
          width: imgWidth,
          height: imgHeight,
          align: 'center'
        });

        doc.moveDown(2);
      } catch (error) {
        console.error(`Error generating visualization:`, error);
        doc.fontSize(12)
           .fillColor('red')
           .text(`Error generating visualization: ${error.message}`);
        doc.moveDown();
      }
    }
  }

  // Add raw data if included
  if (report.includeRawData && report.dataset.data) {
    doc.addPage();
    doc.fontSize(18).text('Raw Data', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text(JSON.stringify(report.dataset.data, null, 2));
  }

  doc.end();
}

async function generateExcel(report: any, res: NextApiResponse) {
  const workbook = new ExcelJS.Workbook();
  
  // Parse metrics and visualizations from JSON strings
  const metrics = typeof report.metrics === 'string' ? JSON.parse(report.metrics) : report.metrics;
  const visualizations = typeof report.visualizations === 'string' ? JSON.parse(report.visualizations) : report.visualizations;

  // Overview Sheet
  const overviewSheet = workbook.addWorksheet('Overview');
  overviewSheet.addRow(['Report Title', report.title]);
  overviewSheet.addRow(['Description', report.description]);
  overviewSheet.addRow(['Dataset', report.dataset?.name || 'N/A']);
  overviewSheet.addRow(['Dataset Type', report.dataset?.type || 'N/A']);
  overviewSheet.addRow([]);

  // Metrics Sheet
  if (metrics && Array.isArray(metrics)) {
    const metricsSheet = workbook.addWorksheet('Metrics');
    metricsSheet.addRow(['Metric', 'Value']);
    metrics.forEach((metric: any) => {
      if (metric && metric.id) {
        metricsSheet.addRow([metric.id, formatMetricValue(metric.value)]);
      }
    });
  }

  // Visualizations Sheet
  if (visualizations && Array.isArray(visualizations)) {
    const vizSheet = workbook.addWorksheet('Visualizations');
    vizSheet.addRow(['Visualization', 'Type', 'Data Points']);
    visualizations.forEach((viz: any) => {
      if (viz && viz.id) {
        vizSheet.addRow([viz.id, viz.id, viz.data?.labels?.length || 0]);
      }
    });
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=report-${report.id}.xlsx`);

  await workbook.xlsx.write(res);
}

async function generateCSV(report: any, res: NextApiResponse) {
  // Parse metrics and visualizations from JSON strings
  const metrics = typeof report.metrics === 'string' ? JSON.parse(report.metrics) : report.metrics;
  const visualizations = typeof report.visualizations === 'string' ? JSON.parse(report.visualizations) : report.visualizations;

  const csvData = [];

  // Report Overview
  csvData.push(['Report Overview']);
  csvData.push(['Title', report.title]);
  csvData.push(['Description', report.description]);
  csvData.push(['Dataset', report.dataset?.name || 'N/A']);
  csvData.push(['Dataset Type', report.dataset?.type || 'N/A']);
  csvData.push([]);

  // Metrics
  if (metrics && Array.isArray(metrics)) {
    csvData.push(['Metrics']);
    csvData.push(['Metric', 'Value']);
    metrics.forEach((metric: any) => {
      if (metric && metric.id) {
        csvData.push([metric.id, formatMetricValue(metric.value)]);
      }
    });
    csvData.push([]);
  }

  // Visualizations
  if (visualizations && Array.isArray(visualizations)) {
    csvData.push(['Visualizations']);
    csvData.push(['Visualization', 'Type', 'Data Points']);
    visualizations.forEach((viz: any) => {
      if (viz && viz.id) {
        csvData.push([viz.id, viz.id, viz.data?.labels?.length || 0]);
      }
    });
  }

  const csv = parse(csvData, { header: false });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=report-${report.id}.csv`);
  res.send(csv);
}

function formatMetricName(metricId: string): string {
  const names: { [key: string]: string } = {
    'total-revenue': 'Total Revenue',
    'growth-rate': 'Growth Rate',
    'top-products': 'Top Products',
    'avg-transaction': 'Average Transaction',
    'sales-by-period': 'Sales by Period'
  };
  return names[metricId] || metricId;
}

function formatChartName(chartId: string): string {
  const names: { [key: string]: string } = {
    'line-chart': 'Revenue Over Time',
    'bar-chart': 'Revenue by Product',
    'pie-chart': 'Product Revenue Distribution',
    'area-chart': 'Cumulative Revenue',
    'scatter-plot': 'Quantity vs Revenue'
  };
  return names[chartId] || chartId;
}

function formatMetricValue(value: any): string {
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  return String(value);
}
