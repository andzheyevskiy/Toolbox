const fs = require('fs')
const path = require('path')
const { Console } = require('console');

let currentLogDir
let stdoutLog
let stderrLog
let logStream

function updateConsole() {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const logDir = path.join(__dirname, "logs", year, month)

    if(logDir !== currentLogDir){
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true })
        }

        currentLogDir = logDir
        stdoutLog = fs.createWriteStream(path.join(logDir, "stdout.log"),{flags: "a"}) /* flags: a - Append || w - Write || r - Read */
        stderrLog = fs.createWriteStream(path.join(logDir, "stderr.log"),{flags: "a"})
        logStream = new Console(stdoutLog,stderrLog)
    }

    return null
}

function logMessage(message, type = "log") {

    updateConsole()

    if(typeof message !== "string"){
        message = JSON.stringify(message)
    }

    if (type === "log") {
        logStream.log(message)
    } else if (type === "error") {
        logStream.error(message)
    }

}