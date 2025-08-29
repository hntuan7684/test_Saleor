// utils/testResultLogger.js
// import ExcelJS from "exceljs";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";

const filePath = path.resolve("TestCaseResult.xlsx");
let workbook;
let worksheet;

// Hàm lấy tên file test (ví dụ: "products" từ "products.spec.js")
function getTestFileName() {
  const testFile = new Error().stack.match(/at.*\((.*\.spec\.js)/)?.[1];
  return testFile ? path.basename(testFile, ".spec.js") : "DefaultSheet";
}

export async function initExcel() {
  const sheetName = getTestFileName(); // Tự động lấy tên sheet từ tên file test
  workbook = new ExcelJS.Workbook();

  try {
    const buffer = await fs.readFile(filePath);
    await workbook.xlsx.load(buffer);
    worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
      worksheet = workbook.addWorksheet(sheetName);
      setHeader();
    } else {
      // Giữ nguyên dữ liệu cũ (không clear sheet)
      if (worksheet.rowCount <= 1) {
        setHeader(); // Thêm header nếu sheet trống
      }
    }
  } catch (e) {
    // Nếu file chưa tồn tại, tạo mới
    workbook = new ExcelJS.Workbook();
    worksheet = workbook.addWorksheet(sheetName);
    setHeader();
  }
}

function setHeader() {
  worksheet.columns = [
    { header: "Test Case ID", key: "id", width: 15 },
    { header: "Description", key: "description", width: 40 },
    { header: "Input Data", key: "input", width: 40 },
    { header: "Expected Result", key: "expected", width: 40 },
    { header: "Actual Result", key: "actual", width: 40 },
    { header: "Status", key: "status", width: 10 },
    { header: "Timestamp", key: "timestamp", width: 20 }, // 🆕 Thêm cột thời gian
  ];
}

function clearSheetData(sheet) {
  const rowCount = sheet.rowCount;
  if (rowCount > 1) {
    sheet.spliceRows(2, rowCount - 1); // giữ lại header
  }
}

function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1); // tháng từ 0
  const year = now.getFullYear();

  return `${hours}:${minutes}:${seconds}, ${day}-${month}-${year}`;
}

export async function logTestResult({
  id,
  description,
  input,
  expected,
  actual,
  status,
}) {
  if (!worksheet) {
    throw new Error("Excel not initialized. Call initExcel() first.");
  }

  const timestamp = getFormattedTimestamp();

  // Đơn giản là lấy số dòng hiện tại và thêm 1
  const newRowIndex = worksheet.rowCount + 1;

  // Ghi dữ liệu test case vào dòng mới
  worksheet.getRow(newRowIndex).getCell("A").value = id;
  worksheet.getRow(newRowIndex).getCell("B").value = description;
  worksheet.getRow(newRowIndex).getCell("C").value = JSON.stringify(input);
  worksheet.getRow(newRowIndex).getCell("D").value = JSON.stringify(expected);
  worksheet.getRow(newRowIndex).getCell("E").value = JSON.stringify(actual);
  worksheet.getRow(newRowIndex).getCell("F").value = status;
  worksheet.getRow(newRowIndex).getCell("G").value = timestamp;

  try {
    await saveExcel();
  } catch (err) {
    console.error("Lỗi khi ghi file Excel:", err.message);
    await logBackup({
      id,
      description,
      input,
      expected,
      actual,
      status,
      timestamp,
    });
  }
}

export async function saveExcel() {
  const buffer = await workbook.xlsx.writeBuffer();
  await fs.writeFile(filePath, buffer);
}

export async function logBackup(data) {
  const backupFile = path.resolve("test-results-backup.json");

  let existing = [];
  try {
    const content = await fs.readFile(backupFile, "utf-8");
    existing = JSON.parse(content);
  } catch (_) {
    // backup chưa tồn tại, bỏ qua
  }

  existing.push(data);
  await fs.writeFile(backupFile, JSON.stringify(existing, null, 2));
}

export async function openExcelAfterSave() {
  exec(`start excel "${filePath}"`);
}
