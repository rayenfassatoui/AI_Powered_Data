import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartConfiguration } from '@/components/ChartCustomization';
import { VisualizationType } from '@/hooks/useVisualization';

interface Visualization {
  id: string;
  type: VisualizationType;
  mapping: Record<string, string>;
  config: ChartConfiguration;
}

export const downloadPDF = async (visualizations: Visualization[]) => {
  const doc = new jsPDF();
  let yOffset = 20;

  try {
    for (let i = 0; i < visualizations.length; i++) {
      const viz = visualizations[i];
      
      if (i > 0) {
        doc.addPage();
        yOffset = 20;
      }

      // Add title
      doc.setFontSize(16);
      doc.text(viz.config.title || `Visualization ${i + 1}`, 20, yOffset);
      yOffset += 10;

      // Add chart type
      doc.setFontSize(12);
      doc.text(`Type: ${viz.type}`, 20, yOffset);
      yOffset += 10;

      // Add mapping information
      doc.setFontSize(10);
      Object.entries(viz.mapping).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 20, yOffset);
        yOffset += 5;
      });

      // Add configuration details
      yOffset += 5;
      doc.text('Chart Configuration:', 20, yOffset);
      yOffset += 5;
      Object.entries(viz.config).forEach(([key, value]) => {
        if (key !== 'data' && typeof value !== 'object') {
          doc.text(`${key}: ${value}`, 20, yOffset);
          yOffset += 5;
        }
      });

      // Capture and add chart image
      try {
        const chartElement = document.querySelector(`[data-viz-id="${viz.id}"]`) as HTMLElement;
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: null
          });

          // Calculate dimensions to fit the page while maintaining aspect ratio
          const pageWidth = doc.internal.pageSize.getWidth();
          const imgWidth = pageWidth - 40; // 20px margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Check if we need to add a new page for the chart
          if (yOffset + imgHeight > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yOffset = 20;
          }

          // Add the chart image
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 20, yOffset, imgWidth, imgHeight);
          yOffset += imgHeight + 10;
        } else {
          console.warn(`Chart element not found for visualization ${viz.id}`);
          // Add placeholder if chart capture fails
          doc.setDrawColor(200, 200, 200);
          doc.rect(20, yOffset, 170, 100);
          doc.text('Chart Preview Not Available', 70, yOffset + 50);
          yOffset += 110;
        }
      } catch (error) {
        console.error('Error capturing chart:', error);
        // Add placeholder if chart capture fails
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yOffset, 170, 100);
        doc.text('Error Capturing Chart Preview', 70, yOffset + 50);
        yOffset += 110;
      }
    }

    // Save the PDF
    doc.save('visualizations.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
