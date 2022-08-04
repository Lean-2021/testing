const express = require("express");
const os = require("os");
const compression = require("compression");
const winston = require("winston");

const PORT = process.env.PORT || 8080;
const app = express();

const logger = winston.createLogger({
  //mostrar por consola mensajes con winston
  level: "info",
  transports: [new winston.transports.Console({ level: "info" })],
});

const loggerWarn = winston.createLogger({
  //guardar en archivo mensajes de advertencias con winston
  level: "warn",
  transports: [
    new winston.transports.File({ filename: "warn.log", level: "warn" }),
  ],
});

const loggerError = winston.createLogger({
  //guardar en archivo mensajes de error con winston
  level: "error",
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/public", express.static("public"));

app.get("/info", compression(), (req, res) => {  //ruta info
  const datos = {
    system: process.platform,
    version: process.version,
    memory: process.memoryUsage.rss(),
    path: process.execPath,
    id: process.pid,
    folder: process.cwd(),
    cpu: os.cpus().length,
  };
  // console.log(datos);
  // logger.log("info", datos);
  res.render("index", {
    system: process.platform,
    version: process.version,
    memory: process.memoryUsage.rss(),
    path: process.execPath,
    id: process.pid,
    folder: process.cwd(),
    cpu: os.cpus().length,
  });
});
app.get("/products/:id", (req, res) => {  //ruta productos
  const { id } = req.params;
  if (parseInt(id) === 1) {
    res.render("product", {
      category: "Monitores",
      brand: "Samsung",
      model: "A330N",
    });
    logger.log("info", "producto existente");
  } else {
    loggerError.log("error", "el productos solicitado no existe");
    logger.log("error", "el producto solicitado no existe");
    res.render("error404", {
      message: "El producto no existe",
    });
  }
});

app.get("*", (req, res) => {
  logger.log("warn", "ruta inexistente");
  loggerWarn.log("warn", "Ruta inexistente");
  res.render("error404", {
    message: "La ruta especificada es inexistente",
  });
});

app.listen(PORT, () => {
  logger.log("info", `Server on port ${PORT}...`);
});
