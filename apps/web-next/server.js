// Servidor Node.js custom para Next.js — requerido por plataformas de hosting
// (como Hostinger Node.js Apps) que ejecutan "node <archivo>" y no aceptan el
// binario de CLI "next start" como archivo de entrada.
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0", () => {
    console.log(`> Listo en http://0.0.0.0:${port}`);
  });
});
