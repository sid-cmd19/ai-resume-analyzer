
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface PdfToImageResult {
  imageUrl: string;
  file: File | null;
  error: string | null;
}

export const convertPdfToImage = async (
  pdfFile: File
): Promise<PdfToImageResult> => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    // Convert the first page of the PDF to an image.
    const page = await pdf.getPage(1);

    // Higher scale produces a sharper image.
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create canvas context");
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to generate image"));
        }
      }, "image/png");
    });

    const imageFile = new File(
      [blob],
      pdfFile.name.replace(/\.pdf$/i, ".png"),
      { type: "image/png" }
    );

    const imageUrl = URL.createObjectURL(blob);

    // Clean up resources.
    canvas.width = 0;
    canvas.height = 0;
    // await pdf.destroy();

    return {
      imageUrl,
      file: imageFile,
      error: null,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err);

    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${message}`,
    };
  }
};
