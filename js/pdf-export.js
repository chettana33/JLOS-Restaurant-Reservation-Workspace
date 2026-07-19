/**
 * Production-ready client-side PDF export for the live quotation preview.
 *
 * The exporter intentionally avoids third-party runtime dependencies so the
 * static workspace can export offline. It captures the currently rendered A4
 * landscape preview as a high-resolution canvas, embeds that image into a
 * single-page A4 landscape PDF, and downloads it with the required filename.
 */

const A4_LANDSCAPE_MM = Object.freeze({
  width: 297,
  height: 210,
});

const PDF_POINTS_PER_MM = 72 / 25.4;
const EXPORT_SCALE = 3;
const MINIMUM_PROGRESS_MS = 350;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml";

function createExportFilename(now = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());

  return `Quotation-${year}${month}${day}-${hours}${minutes}.pdf`;
}

function escapePdfString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function getAllStyles() {
  return Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

async function waitForImages(element) {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        }),
    ),
  );
}

function clonePreviewForExport(previewElement, width, height) {
  const clone = previewElement.cloneNode(true);

  clone.removeAttribute("id");
  clone.removeAttribute("aria-live");
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.maxWidth = "none";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.transform = "none";

  return clone;
}

function createSvgDataUrl(previewElement, width, height) {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  const foreignObject = document.createElementNS(SVG_NAMESPACE, "foreignObject");
  const wrapper = document.createElementNS(XHTML_NAMESPACE, "div");
  const style = document.createElementNS(XHTML_NAMESPACE, "style");
  const clone = clonePreviewForExport(previewElement, width, height);

  svg.setAttribute("xmlns", SVG_NAMESPACE);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");

  style.textContent = `
    ${getAllStyles()}
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; }
    .output-preview-paper, .preview-paper {
      width: ${width}px !important;
      height: ${height}px !important;
      max-width: none !important;
      aspect-ratio: ${width} / ${height} !important;
      box-shadow: none !important;
    }
  `;

  wrapper.setAttribute("xmlns", XHTML_NAMESPACE);
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.overflow = "hidden";
  wrapper.style.background = "#ffffff";
  wrapper.append(style, clone);
  foreignObject.append(wrapper);
  svg.append(foreignObject);

  const serializedSvg = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serializedSvg)}`;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The quotation preview could not be rendered for PDF export."));
    image.src = source;
  });
}

async function renderPreviewToJpeg(previewElement) {
  const rect = previewElement.getBoundingClientRect();
  const sourceWidth = Math.ceil(rect.width);
  const sourceHeight = Math.ceil(rect.height);

  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("The quotation preview is not available for PDF export.");
  }

  await waitForImages(previewElement);

  const image = await loadImage(createSvgDataUrl(previewElement, sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("Your browser does not support PDF canvas rendering.");
  }

  canvas.width = sourceWidth * EXPORT_SCALE;
  canvas.height = sourceHeight * EXPORT_SCALE;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.96),
    width: canvas.width,
    height: canvas.height,
  };
}

function dataUrlToBinaryString(dataUrl) {
  const [, base64 = ""] = dataUrl.split(",");
  return atob(base64);
}

function buildPdfDocument({ imageDataUrl, imageWidth, imageHeight, filename }) {
  const pageWidth = A4_LANDSCAPE_MM.width * PDF_POINTS_PER_MM;
  const pageHeight = A4_LANDSCAPE_MM.height * PDF_POINTS_PER_MM;
  const imageBinary = dataUrlToBinaryString(imageDataUrl);
  const objects = [];

  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth.toFixed(4)} ${pageHeight.toFixed(
      4,
    )}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`,
  );
  const imageId = addObject(
    `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBinary.length} >>\nstream\n${imageBinary}\nendstream`,
  );
  const contentStream = `q\n${pageWidth.toFixed(4)} 0 0 ${pageHeight.toFixed(4)} 0 0 cm\n/Im1 Do\nQ`;
  const contentId = addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
  const infoId = addObject(
    `<< /Title (${escapePdfString(filename.replace(/\\.pdf$/i, ""))}) /Creator (Japan Land Operator Suite) /Producer (JLOS PDF Export) >>`,
  );

  void catalogId;
  void pageId;
  void imageId;
  void contentId;

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];

  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index) & 0xff;
  }

  return new Blob([bytes], { type: "application/pdf" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function setButtonState(button, { isExporting, label }) {
  button.disabled = isExporting;
  button.setAttribute("aria-busy", String(isExporting));
  button.textContent = label;
}

function showExportMessage(button, message, isError = false) {
  const id = "pdf-export-status";
  let status = document.querySelector(`#${id}`);

  if (!status) {
    status = document.createElement("span");
    status.id = id;
    status.className = "pdf-export-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    button.insertAdjacentElement("afterend", status);
  }

  status.textContent = message;
  status.classList.toggle("pdf-export-status--error", isError);
}

export function initializePdfExport({ button, previewElement }) {
  if (!button || !previewElement) {
    return () => {};
  }

  const defaultLabel = button.textContent || "Export PDF";

  const handleExport = async () => {
    const filename = createExportFilename();
    const exportStartedAt = performance.now();

    try {
      showExportMessage(button, "Preparing PDF…");
      setButtonState(button, { isExporting: true, label: "Exporting…" });

      const renderedImage = await renderPreviewToJpeg(previewElement);
      showExportMessage(button, "Downloading PDF…");
      const pdfBlob = buildPdfDocument({
        imageDataUrl: renderedImage.dataUrl,
        imageWidth: renderedImage.width,
        imageHeight: renderedImage.height,
        filename,
      });

      downloadBlob(pdfBlob, filename);
      await wait(Math.max(0, MINIMUM_PROGRESS_MS - (performance.now() - exportStartedAt)));
      showExportMessage(button, `Exported ${filename}`);
    } catch (error) {
      console.error("PDF export failed.", error);
      showExportMessage(button, "PDF export failed. Please try again.", true);
    } finally {
      setButtonState(button, { isExporting: false, label: defaultLabel });
    }
  };

  button.addEventListener("click", handleExport);

  return () => button.removeEventListener("click", handleExport);
}
