import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

export interface Data {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string | Date;
}

export async function downloadPDF(data: Data) {
  if (!data) return;

  // Create a temporary element to render the blog content
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "fixed";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "0";
  tempDiv.style.width = "800px";
  tempDiv.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 24px; width: 100%;">
      <h1 style="font-size: 2em; margin-bottom: 0.5em;">${data.title}</h1>
      <div style="color: #888; margin-bottom: 1em;">
        ${format(new Date(data.createdAt), "MMM dd, yyyy")}
      </div>
      ${
        data.imageUrl
          ? `<img src="${data.imageUrl}" alt="Blog Image" style="max-width: 100%; margin-bottom: 1em;" />`
          : ""
      }
      <div style="white-space: pre-wrap; font-size: 1em;">${data.content}</div>
    </div>
  `;
  document.body.appendChild(tempDiv);

  const canvas = await html2canvas(tempDiv);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 40;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
  pdf.save(`${data.title}.pdf`);
  document.body.removeChild(tempDiv);
}
