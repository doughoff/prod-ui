import React from "react";
import { PageContent, PageHeader } from "../../components";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { PdfField, generatePDF } from "../../utils/generatePdf";

const IndexPage: React.FC = () => {
  return (
    <>
      <PageHeader
        items={[
          {
            title: "App",
          },
        ]}
        pageTitle="Pagina de Inicio"
      />
      <PageContent>
        <>
          <Button
            icon={<FilePdfOutlined />}
            onClick={() =>
              generatePDF(
                {
                  pageSize: "A4",
                  pageMargins: [40, 140, 40, 60],
                  header: function (currentPage: number, pageCount: number) {
                    return [
                      {
                        text: currentPage.toString() + " de " + pageCount,
                        alignment: "right",
                        margin: [20, 10],
                      },
                      {
                        margin: [40, 5],
                        columns: [
                          PdfField("label", "value"),
                          PdfField("label", "value"),
                          PdfField("label", "value"),
                        ],
                        columnGap: 10,
                      },
                      {
                        margin: [40, 5],
                        columns: [
                          PdfField("label", "value"),
                          PdfField("label", "value"),
                        ],
                        columnGap: 10,
                      },
                    ];
                  },

                  content: [
                    {
                      table: {
                        widths: ["*", 120, 120],
                        headerRows: 1,
                        body: [
                          [
                            { text: "Title 1", style: "tableHeader" },
                            { text: "Title 2", style: "tableHeader" },
                            { text: "Title 3", style: "tableHeader" },
                          ],
                          [
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                          ],
                          [
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                          ],
                          [
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                          ],
                          [
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                          ],
                          [
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                            { text: `test`, style: "tableItems" },
                          ],
                        ],
                      },
                    },
                  ],
                  styles: {
                    tableHeader: {
                      bold: true,
                      fontSize: 13,
                      color: "black",
                    },
                    tableItems: {
                      fontSize: 13,
                      color: "black",
                    },
                    fieldLabel: {
                      fontSize: 10,
                      color: "black",
                    },
                    fieldValue: {
                      fontSize: 13,
                      color: "black",
                    },
                  },
                },
                "test"
              )
            }
          />
        </>
      </PageContent>
    </>
  );
};

export default IndexPage;
