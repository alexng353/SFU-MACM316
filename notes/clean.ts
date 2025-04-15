import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const inputDir = "./lectures";
const outputDir = "./cleaned";

await mkdir(outputDir, { recursive: true });

const files = (await readdir(inputDir)).filter((f) => f.endsWith(".tex"));

for (const file of files) {
  const inputPath = join(inputDir, file);
  const outputPath = join(outputDir, file);

  const content = await readFile(inputPath, "utf8");

  // Extract between \begin{document} and \end{document}
  const docMatch = content.match(/\\begin{document}([\s\S]*?)\\end{document}/);
  if (!docMatch) {
    console.warn(`⚠️ Could not find document block in ${file}`);
    continue;
  }

  let body = docMatch[1];

  // Remove \title{}, \author{}, \date{}, and \maketitle
  body = body
    .replace(/\\title{[^}]*}\s*/g, "")
    .replace(/\\author{[^}]*}\s*/g, "")
    .replace(/\\date{[^}]*}\s*/g, "")
    .replace(/\\maketitle\s*/g, "");

  await writeFile(outputPath, body.trimStart(), "utf8");
  console.log(`✅ Cleaned: ${file}`);
}
