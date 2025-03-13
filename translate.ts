import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const messagesDir = path.join(process.cwd(), "messages");
const backupDir = path.join(process.cwd(), "messages_backup");

// Step 1: Back up the contents of all JSON files in ./messages
const backupJsonFiles = () => {
  if (!fs.existsSync(messagesDir)) {
    console.error("Messages directory does not exist.");
    return;
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const content = fs.readFileSync(path.join(messagesDir, file), "utf8");
      fs.writeFileSync(path.join(backupDir, file), content, "utf8");
    }
  });
  console.log("Backup completed for all JSON files.");
};

// Step 2: Clear the content of all JSON files in ./messages
const clearJsonFiles = () => {
  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      fs.writeFileSync(path.join(messagesDir, file), "{}", "utf8");
    }
  });
  console.log("Cleared all JSON files in messages directory.");
};

// Step 3: Run next-intl-scanner extract
const extractTranslations = () => {
  try {
    execSync("npx next-intl-scanner extract", { stdio: "inherit" });
    console.log("Extracted translations successfully.");
  } catch (error) {
    console.error("Error running next-intl-scanner:", error);
  }
};

// Step 4: Compare with the backup and restore values if available
const restoreFromBackup = () => {
  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(messagesDir, file);
      const backupFilePath = path.join(backupDir, file);

      if (!fs.existsSync(backupFilePath)) return;

      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const backupData = JSON.parse(fs.readFileSync(backupFilePath, "utf8"));

      // Merge values from backup
      Object.keys(backupData).forEach((key) => {
        if (backupData[key]) {
          jsonData[key] = backupData[key];
        }
      });

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
    }
  });
  console.log("Restored values from backup.");
};

// Step 5: Sort the keys of all JSON files in ./messages
const sortJsonKeys = () => {
  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(messagesDir, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const sortedData = Object.keys(jsonData)
        .sort()
        .reduce<Record<string, string>>((obj, key) => {
          obj[key] = jsonData[key];
          return obj;
        }, {});

      fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2), "utf8");
    }
  });
  console.log("Sorted all JSON files in the messages directory.");
};

// Step 6: Delete the backup directory
const deleteBackup = () => {
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
    console.log("Deleted backup directory.");
  }
};

// Run the steps in sequence
backupJsonFiles();
clearJsonFiles();
extractTranslations();
restoreFromBackup();
sortJsonKeys();
deleteBackup();
