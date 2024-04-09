const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const spawn = require("await-spawn");

const CONFIG_STORAGE = "./.config";
const PORT = process.env.PORT || 8080;
process.env.PUPPETEER_DISABLE_HEADLESS_WARNING = true;

const mkdirConfig = function (dirPath) {
  const directory = path.normalize(dirPath);
  const parts = directory.split(path.sep);

  for (let i = 1; i <= parts.length; i++) {
    let part = path.join.apply(null, parts.slice(0, i));
    if (!fs.existsSync(part)) fs.mkdirSync(part);
  }
};

const app = express();
app.use(express.json());
mkdirConfig(CONFIG_STORAGE);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.post("/", async (request, response) => {
  let uuid = uuidv4();

  let config = CONFIG_STORAGE + "/" + uuid + ".json";

  fs.writeFile(config, JSON.stringify(request.body), (err) => {
    if (err) throw err;
  });

  try {
    let result = await spawn("./node_modules/.bin/pa11y-ci", [
      "--json",
      "--config",
      config,
    ]);

    response.send(JSON.parse(result.toString()));
  } catch (e) {
    if (e.stderr.length > 0) {
      response.status(500).send({ error: e.stderr.toString() });
    } else {
      response.send(JSON.parse(e.stdout.toString()));
    }
  }

  fs.unlink(config, (err) => {
    if (err) throw err;
  });
});
