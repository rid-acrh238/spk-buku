const fs = require("fs");
const path = require("path");

const IGNORE = ["node_modules", ".git"];

function tree(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(item => !IGNORE.includes(item.name));

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    console.log(prefix + pointer + item.name);

    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      tree(path.join(dir, item.name), newPrefix);
    }
  });
}

console.log(".");
tree(process.cwd());
