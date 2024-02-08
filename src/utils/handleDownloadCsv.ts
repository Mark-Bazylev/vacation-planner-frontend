import { VacationReport } from "../redux/vacation/vacationSlice";

const generateCsvContent = (vacationsReport: VacationReport) => {
  let csvContent = "Destination,Followers\n";

  vacationsReport.forEach((vacation) => {
    const row = `"${vacation.destination}", ${vacation.followers.length}\n`;
    csvContent += row;
  });

  return csvContent;
};

export function handleDownloadCsv(vacationsReport: VacationReport) {
  return () => {
    const csvContent = generateCsvContent(vacationsReport);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vacation followers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}
