const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')

const app = express()
// const verifyTokenAsync = util.promisify(jwt.verify) // USE ONLY WITH TRY CATCH

app.use(bodyParser.json())

const usersSchema = mongoose.Schema({
    username: {
        type: String,
        min: [4, "Usernama has to have atleast 4 characters"],
        max: [16, "Username has to have less than 16 charaters"],
        requied: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", usersSchema)

const secretKey = process.env.JTWKEY

app.post("/register", async function (req, res) {
    const { username, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ username: username, password: hashed })
    const saved = await user.save()
    res.status(201).send("User Registred")
})

app.post("login", async function (req, res) {
    const { username, password } = req.body
    const doesExist = User.find({ username: username })

    if (doesExist && bcrypt.compare(password, doesExist.password)) {
        const token = jwt.sign({ username: doesExist.username }, secretKey, { expiresIn: "30d" })
        res.json({token})
    } else {
        res.status(400).send("Invalid credentials")
    }
})

function authentificateToken(req, res, next) {
    const authHeader = req.headers["jwt-auth"]
    const token = authHeader && authHeader.split(" ")[1]
    const recievedUser = req.params.username || req.body.username

    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        if (recievedUser && recievedUser != user.username) {
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}


app.get("/protected", authentificateToken)

