const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const readFile = util.promisify(fs.readFile);
const opn = require("opn");

const workerUrl = 'https://cloudflareworkers.com';

async function newWorker(script) {
  let resp = await fetch(`${ workerUrl }/script`, {
    method: "POST",
    headers: {
      "cache-control": "no-cache",
      "content-type": "text/javascript"
    },
    body: script
  });

  let data = await resp.json();

  return data.id;
}

readFile("dist/worker.js", "utf8").then(data => {
  newWorker(data).then(id => {
    console.log(`opening ${ workerUrl }/#${ id }:https://cloudflaregraphql.com`)
    opn(
      `${ workerUrl }/#${ id }:https://cloudflaregraphql.com`
    ).catch(e => console.dir(e))
  }).catch(e => console.dir(e));
}).catch(e => console.dir(e));
