import { api } from "../config/api";

async function downloadFile(url: string, filename: string) {
  const response = await api.get(url, { responseType: "blob" });
  const href     = URL.createObjectURL(response.data);
  const a        = document.createElement("a");
  a.href         = href;
  a.download     = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}

export const downloadTransactionsPDF = () =>
  downloadFile("/reports/transactions/pdf/", "transactions_kharandi.pdf");

export const downloadStudentReportPDF = () =>
  downloadFile("/reports/student/pdf/", "mon_bulletin.pdf");

export const downloadStatsExcel = () =>
  downloadFile("/reports/stats/excel/", "stats_kharandi.xlsx");
