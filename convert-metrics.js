const XLSX = require("xlsx");
const fs = require("fs");

// Adjust the path if your Excel file is elsewhere
const workbook = XLSX.readFile("./public/ValuedMetrics.xlsx");
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

fs.writeFileSync("./public/valued-metrics.json", JSON.stringify(data, null, 2));
console.log("Excel converted to JSON! Output: ./public/valued-metrics.json"); 