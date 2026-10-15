const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const port = Number(process.env.PORT || 4175);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};
const allowed = new Set([
  "index.html",
  "style.css",
  "core.js",
  "scenes.js",
  "app.js",
]);
const server = http.createServer((req, res) => {
  let name;
  try {
    name =
      decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(
        /^\//,
        "",
      ) || "index.html";
  } catch {
    res.writeHead(400);
    return res.end("Bad request");
  }
  if (!allowed.has(name)) {
    res.writeHead(404);
    return res.end("Not found");
  }
  fs.readFile(path.join(root, name), (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Read failed");
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(name)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Foley Illusion Lab: http://127.0.0.1:${port}`),
);
server.on("error", (err) => {
  console.error(err.message);
  process.exitCode = 1;
});
