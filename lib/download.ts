import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { formatDateForFilename } from "./date";

/**
 * Flattens one level of nested objects in a row.
 * If a value is a plain object (not array, not null), its keys/values are merged into the result.
 * The parent key is omitted.
 */
function flattenRow(row: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        result[subKey] = subValue;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Flattens an array of rows, collecting all unique keys for headers.
 */
function flattenData(
  data: Record<string, unknown>[],
): Record<string, unknown>[] {
  return data.map(flattenRow);
}

/**
 * Type for tabular data: an array of objects with string keys.
 */
type TabularData = Record<string, unknown>[];

/**
 * Download data as a CSV file.
 * @param data - Array of objects to export.
 * @param filename - Name of the resulting CSV file.
 */
export const downloadCSV = (data: TabularData, filename = "data") => {
  if (!Array.isArray(data) || data.length === 0) return;

  const flatData = flattenData(data);

  // Collect all unique headers from all rows
  const headersSet = new Set<string>();
  flatData.forEach((row) =>
    Object.keys(row).forEach((key) => headersSet.add(key)),
  );
  const headers = Array.from(headersSet);

  const fullFilename = `${filename}_${formatDateForFilename(new Date())}.csv`;

  const csvContent = [
    headers.join(","), // header row
    ...flatData.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return JSON.stringify(value ?? "");
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fullFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download data as an Excel file.
 * @param data - Array of objects to export.
 * @param filename - Name of the resulting Excel file.
 */
export const downloadExcel = (data: TabularData, filename = "data") => {
  if (!Array.isArray(data) || data.length === 0) return;

  const flatData = flattenData(data);

  const fullFilename = `${filename}_${formatDateForFilename(new Date())}.xlsx`;

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fullFilename);
};

/**
 * Download data as a PDF file with a table.
 * @param data - Array of objects to export.
 * @param filename - Name of the resulting PDF file.
 */
export const downloadPDF = (data: TabularData, filename = "data") => {
  if (!Array.isArray(data) || data.length === 0) return;

  const flatData = flattenData(data);

  const fullFilename = `${filename}_${formatDateForFilename(new Date())}.pdf`;

  const doc = new jsPDF();

  // Collect all unique headers from all rows
  const headersSet = new Set<string>();
  flatData.forEach((row) =>
    Object.keys(row).forEach((key) => headersSet.add(key)),
  );
  const headers = Array.from(headersSet);

  const columns = headers.map((key) => ({
    header: key.charAt(0).toUpperCase() + key.slice(1),
    dataKey: key,
  }));

  const tableRows = flatData.map((row) =>
    Object.fromEntries(
      columns.map((col) => [col.dataKey, String(row[col.dataKey] ?? "")]),
    ),
  );

  autoTable(doc, {
    columns,
    body: tableRows,
    styles: { overflow: "linebreak", cellWidth: "auto" },
    tableWidth: "wrap",
    margin: { left: 10, right: 10, top: 10 },
    horizontalPageBreak: true, // <--- This enables horizontal splitting
    headStyles: { fillColor: [230, 230, 230] },
  });

  doc.save(fullFilename);
};
