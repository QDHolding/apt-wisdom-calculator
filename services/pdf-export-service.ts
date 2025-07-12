import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export const PdfExportService = {
  // Export element to PDF
  exportToPdf: async (element: HTMLElement, filename: string): Promise<void> => {
    if (!element) {
      throw new Error("Element not found")
    }

    try {
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Calculate PDF dimensions (A4 format)
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4")
      const imgData = canvas.toDataURL("image/png")

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Save PDF
      pdf.save(filename)

      return Promise.resolve()
    } catch (error) {
      console.error("PDF export failed:", error)
      throw error
    }
  },
}

