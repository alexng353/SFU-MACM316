import fs from "fs/promises";
const args = Bun.argv;

const FORCE = args.includes("--force") || args.includes("-f");
const nameIndex = args.indexOf("--name");
let name: string | undefined  = undefined;
if (nameIndex !== -1) {
  name = args[nameIndex + 1];
}

if (args.length < 2) {
  console.error("Usage: bun gen <n> | bun gen -n");
  process.exit(1);
}

const arg1 = args.at(-1);

let n: number;
if (arg1 === "next" || arg1 === "-n") {
  const dir = await fs.readdir(".");
  const files = dir.filter((b) => b.match(/^Lecture \d+\.tex$/));

  files.sort((a, b) => Number.parseInt(a.split(" ")[1]) - Number.parseInt(b.split(" ")[1]));
  n = Number.parseInt(files.at(-1)?.split(" ")[1]!) + 1;
} else {
  n = Number.parseInt(arg1 ?? "NaN");
}

if (Number.isNaN(n)) {
  console.error("n must be a number");
  process.exit(1);
}

const date = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const balls = `\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{amsthm}
\\usepackage{amsfonts}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{hyperref}
\\usepackage{tikz}
\\usepackage{enumitem}
\\usepackage{mathtools}
\\usepackage{enumitem}
\\usepackage{wasysym}
\\usepackage{ulem}
\\usepackage{xspace}
\\usepackage{booktabs}
\\usepackage{physics}

\\ifPDFTeX % ensure generation of machine readable output
\\input{glyphtounicode}
\\pdfgentounicode=1
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\fi

\\usepackage{csquotes}

\\DeclareMathOperator{\\dist}{dist}
\\DeclareMathOperator{\\Nul}{Nul}
\\DeclareMathOperator{\\Row}{Row}
\\DeclareMathOperator{\\proj}{proj}

\\setlength{\\arraycolsep}{12pt}

\\newcommand{\\defn}{\\textbf{Def.}\\xspace}
\\newcommand{\\thm}{\\textbf{Thm.}\\xspace}
\\newcommand{\\ex}{\\textbf{ex.}\\xspace}
\\newcommand{\\Ex}{\\textbf{Ex.}\\xspace}
\\newcommand{\\ie}{\\textbf{i.e.}\\xspace}
\\newcommand{\\lemma}{\\textit{Lemma}\\xspace}
\\newcommand{\\bproof}{\\textit{Proof ($\\impliedby$).}\\xspace}
\\newcommand{\\fproof}{\\textit{Proof ($\\implies$).}\\xspace}
\\newcommand{\\bigEps}{\\mathcal{E}}
\\newcommand{\\soln}{\\textit{Soln.}\\xspace}

\\renewcommand{\\arraystretch}{1.25} % Adjust row spacing

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=blue,      
    urlcolor=blue,
}

\\newcommand{\\ulhref}[2]{\\href{#1}{\\color{blue}\\uline{#2}}}

\\begin{document}

\\title{MACM 316 Lecture ${n}}
\\author{Alexander Ng}
\\date{${date}}

\\maketitle

\\end{document}
`;

const fileName = `Lecture ${n.toString().padStart(3, "0")}.tex`;

const file = Bun.file(fileName);

if (await file.exists() && !FORCE) {
  console.error(`Lecture ${n}.tex already exists\n\tUse --force to overwrite`);
  process.exit(1);
}

file.write(balls);

console.log(`Wrote ` + fileName);
