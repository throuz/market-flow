import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const messagesDir = path.join(process.cwd(), "messages");

// Step 1: Clear the content of all JSON files in ./messages
const clearJsonFiles = () => {
  if (!fs.existsSync(messagesDir)) {
    console.error("Messages directory does not exist.");
    return;
  }

  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      fs.writeFileSync(path.join(messagesDir, file), "{}", "utf8");
    }
  });
  console.log("Cleared all JSON files in messages directory.");
};

// Step 2: Run next-intl-scanner extract
const extractTranslations = () => {
  try {
    execSync("npx next-intl-scanner extract", { stdio: "inherit" });
    console.log("Extracted translations successfully.");
  } catch (error) {
    console.error("Error running next-intl-scanner:", error);
  }
};

// Step 3: Sort the keys of all JSON files in ./messages
const sortJsonKeys = () => {
  if (!fs.existsSync(messagesDir)) {
    console.error("Messages directory does not exist.");
    return;
  }

  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(messagesDir, file);
      const jsonData = fs.readFileSync(filePath, "utf8");
      const parsedData = JSON.parse(jsonData);

      // Sort the keys alphabetically
      const sortedData = Object.keys(parsedData)
        .sort()
        .reduce<Record<string, string>>((obj, key) => {
          obj[key] = parsedData[key];
          return obj;
        }, {});

      // Write the sorted JSON back into the file
      fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2), "utf8");
    }
  });
  console.log("Sorted all JSON files in the messages directory.");
};

// Run the steps in sequence
clearJsonFiles();
extractTranslations();
sortJsonKeys();
