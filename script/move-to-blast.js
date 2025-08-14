#!/usr/bin/env node

import fs from "fs";
import path from "path";

const CRM = 'crm';
const version = process.argv[2] || "listingblast";

// 递归删除目录内容的函数
function clearDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (let entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

// 递归复制目录的函数
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist, skipping...`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  } else {
    // 清空目标文件夹内容
    clearDir(dest);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 复制文件的函数
function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source file ${src} does not exist, skipping...`);
    return;
  }

  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
}

function copyIndexHtml(src, dest){
  fs.copyFileSync(src, dest);
}

// 处理index.html，去掉js/common和checkoutPop相关的引入
function processIndexHtml(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source file ${src} does not exist, skipping...`);
    return;
  }

  let content = fs.readFileSync(src, "utf8");

  // 去掉包含js/common和checkoutPop的行
  const linesToRemove = [
    /.*\/js\/common\.css.*\n?/g,
    /.*\/checkoutPop\.css.*\n?/g,
    /.*\/js\/js\/common-.*\.js.*\n?/g,
    /.*\/checkoutPop-.*\.js.*\n?/g,
  ];

  linesToRemove.forEach((pattern) => {
    content = content.replace(pattern, "");
  });

  // 确保目标目录存在
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.writeFileSync(dest, content, "utf8");
}

// 主执行函数
function main() {
  console.log("Starting file copy process...");
  if (version) {
    console.log(`Received argument: ${version}`);
  }

  try {
    if (!fs.existsSync(`../${CRM}/crm-blast/src/ai/${version}`)) {
      fs.mkdirSync(`../${CRM}/crm-blast/src/ai/${version}`, { recursive: true });
    }

    copyDir("./dist/assets", `../${CRM}/crm-blast/src/ai/${version}/assets`);

    copyDir(
      "./dist/lovable-uploads",
      `../${CRM}/crm-blast/src/ai/${version}/lovable-uploads`,
    );

    processIndexHtml(
      "./dist/index.html",
      `../${CRM}/crm-blast/public/checkout.html`,
    );
    processIndexHtml(
      "./dist/listingblast.html",
      `../${CRM}/crm-blast/public/${version}.html`,
    );

    copyIndexHtml(
      `../${CRM}/crm-blast/public/checkout.html`,
      `../${CRM}/crm-blast/public/buyListingBlast.html`
    )
  } catch (error) {
    console.error("Error during copy process:", error.message);
    process.exit(1);
  }
}

main();
