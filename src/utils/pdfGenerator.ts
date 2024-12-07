import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartConfiguration } from '@/components/ChartCustomization';
import { VisualizationType } from '@/types/visualization';

const getDataMappingDescription = (type: VisualizationType, mapping: Record<string, string>): string[] => {
  const descriptions: string[] = [];
  
  switch (type) {
    case 'timeSeries':
      if (mapping.dateColumn) descriptions.push(`Date Column: ${mapping.dateColumn}`);
      if (mapping.valueColumn) descriptions.push(`Value Column: ${mapping.valueColumn}`);
      break;
    case 'distribution':
      if (mapping.valueColumn) descriptions.push(`Value Column: ${mapping.valueColumn}`);
      break;
    case 'correlation':
      if (mapping.xColumn) descriptions.push(`X Axis: ${mapping.xColumn}`);
      if (mapping.yColumn) descriptions.push(`Y Axis: ${mapping.yColumn}`);
      break;
    case 'pie':
      if (mapping.categoryColumn) descriptions.push(`Category Column: ${mapping.categoryColumn}`);
      if (mapping.valueColumn) descriptions.push(`Value Column: ${mapping.valueColumn}`);
      break;
    case 'radar':
      if (mapping.metrics) descriptions.push(`Metrics: ${mapping.metrics.split(',').join(', ')}`);
      break;
  }

  return descriptions;
};

export const generateVisualizationsPDF = async (visualizations: any[], chartConfigs: ChartConfiguration[]) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Add title
  pdf.setFontSize(20);
  pdf.text('Data Visualizations Report', pageWidth / 2, margin, { align: 'center' });

  // Add date
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - margin, margin + 10, { align: 'right' });

  let yPosition = margin + 20;

  // Capture and add each visualization
  for (let i = 0; i < visualizations.length; i++) {
    const viz = visualizations[i];
    const config = chartConfigs[i];
    const chartElement = document.querySelector(`[data-chart-id="${viz.id}"]`) as HTMLElement;

    if (chartElement) {
      // Add page break if needed
      if (i > 0) {
        pdf.addPage();
        yPosition = margin;
      }

      // Add visualization title
      pdf.setFontSize(16);
      pdf.text(`Visualization ${i + 1}: ${config?.title || 'Untitled'}`, margin, yPosition);
      yPosition += 10;

      // Add visualization details
      pdf.setFontSize(12);
      pdf.text(`Chart Type: ${viz.type}`, margin, yPosition);
      yPosition += 7;

      // Add data mapping information
      const mappingDescriptions = getDataMappingDescription(viz.type, viz.mapping);
      if (mappingDescriptions.length > 0) {
        pdf.text('Data Mapping:', margin, yPosition);
        yPosition += 7;
        mappingDescriptions.forEach(desc => {
          pdf.text(`• ${desc}`, margin + 5, yPosition);
          yPosition += 7;
        });
      }

      // Add axis information if available
      if (config?.xAxis) {
        pdf.text(`X-Axis Label: ${config.xAxis}`, margin, yPosition);
        yPosition += 7;
      }
      if (config?.yAxis) {
        pdf.text(`Y-Axis Label: ${config.yAxis}`, margin, yPosition);
        yPosition += 7;
      }

      // Add description if available
      if (config?.description) {
        yPosition += 5;
        pdf.text('Description:', margin, yPosition);
        yPosition += 7;
        
        const splitDescription = pdf.splitTextToSize(config.description, pageWidth - (margin * 2));
        pdf.text(splitDescription, margin, yPosition);
        yPosition += (splitDescription.length * 7);
      }

      try {
        // Capture the chart as an image
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: null
        });

        // Calculate image dimensions to fit the page
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if the image will fit on the current page
        if (yPosition + imgHeight + margin > pageHeight) {
          pdf.addPage();
          yPosition = margin;
        }

        // Add the chart image
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + margin;
      } catch (error) {
        console.error('Error capturing visualization:', error);
        pdf.text('Error: Could not capture visualization', margin, yPosition);
        yPosition += 10;
      }
    }
  }

  return pdf;
};

export const downloadPDF = async (visualizations: any[], chartConfigs: ChartConfiguration[]) => {
  try {
    const pdf = await generateVisualizationsPDF(visualizations, chartConfigs);
    pdf.save(`visualizations-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
