import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TFontDictionary } from "pdfmake/interfaces";
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<TFontDictionary>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function generatePDF(
  documentDefinition: TDocumentDefinitions,
  filename: string
): void {
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

  pdfDocGenerator.getBlob((pdfBlob: Blob) => {
    savePDFToFile(pdfBlob, filename + ".pdf");
  });
}

function savePDFToFile(pdfBlob: Blob, filename: string): void {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(pdfBlob);
  downloadLink.download = filename;
  downloadLink.click();
}

//COMPONENTS

export const PdfField = (label: string, value: string) => {
  return {
    table: {
      widths: ["*"],
      body: [
        [
          {
            table: {
              body: [
                [
                  {
                    text: `${label}`,
                    style: "fieldLabel",
                  },
                ],
                [
                  {
                    text: `${value}`,
                    style: "fieldValue",
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
        ],
      ],
    },
  };
};

//TEMPLATES
