'use strict';

const express = require('express')
const uuidv4 = require('uuid/v4')
const fs = require("fs")
const path = require("path")
const spawn = require("child_process").spawn

const CONFIG_STORAGE = '.config'
const PORT = 8080
const HOST = '0.0.0.0'

function errorHandler (err, request, response, next) {
    response.status(err.statusCode).send()
}

const mkdirConfig = function (dirPath) {
    const directory = path.normalize(dirPath)
    const parts = directory.split(path.sep)

    for (let i = 1; i <= parts.length; i++) {
        var part = path.join.apply(null, parts.slice(0, i))
        if (!fs.existsSync(part)) fs.mkdirSync(part)
    }
}

const app = express()
app.use(express.json())
app.use(errorHandler)

mkdirConfig(CONFIG_STORAGE)

app.post('/', (request, response) => {
    var uuid = uuidv4()
    var config = CONFIG_STORAGE + '/' + uuid + ".json"

    fs.writeFile(config, JSON.stringify(request.body), (err) => {
        if (err) throw err
    });

    var process = spawn('./node_modules/.bin/pa11y-ci', ['--json', '--config', config])

    process.stdout.on('data', (data) => {
        response.send(data.toString())
        fs.unlink(config, (err) => {
            if (err) throw err;
        })
    })

    process.stderr.on('data', (data) => {
        response.status(500).send({error: data.toString()})
    })
})

app.listen(PORT, HOST)

console.log(`Running on http://${HOST}:${PORT}`)