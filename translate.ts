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

clearJsonFiles();
extractTranslations();
