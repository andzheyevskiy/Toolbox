const fs = require('fs')
const path = require('path')
const { Console } = require('console');

class CustomConsole {
    constructor() {
        this.logDir = undefined
        this.stdoutLog = undefined
        this.stderrLog = undefined
        this.console = undefined
    }

    #update() {
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, "0")
        const newLogDir = path.join(__dirname, "logs", year, month)

        if (newLogDir !== this.logDir) {
            if (!fs.existsSync(newLogDir)) {
                fs.mkdirSync(newLogDir, { recursive: true })
            }

            this.logDir = newLogDir
            this.stdoutLog = fs.createWriteStream(path.join(this.logDir, "stdout.log"), { flags: "a" })
            this.stderrLog = fs.createWriteStream(path.join(this.logDir, "stderr.log"), { flags: "a" })
            this.console = new Console(this.stdoutLog, this.stderrLog)
        }
    }

    log(...args) {
        this.#update()
        const res = args.join("") + "\n"
        this.console.log(res)
    }

    error(...args) {
        this.#update()
        const res = args.join("") + "\n"
        this.console.error(res)
    }

}

const customConsole = new CustomConsole()
module.exports = customConsole