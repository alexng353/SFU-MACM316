import fs from "fs";


const files = fs.readdirSync(".");

const pruned = files.filter(file => file.includes(".pdf") || file.includes("tex"));

for (const file of pruned) {
  const newName = file.replace(/Lecture (\d+)/, (_, num) => `Lecture ${num.padStart(3, '0')}`);
  fs.renameSync(file, newName);
}
