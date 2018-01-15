
const express = require("express");
const employeeRoutes = require("./routes/employee")
const userRoutes = require("./routes/user")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

const passport = require("passport")
const BearerStrategy = require("passport-http-bearer").Strategy

const jwt = require("jsonwebtoken");



const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();

})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'))
app.use(passport.initialize());


// app.post("/upload", (req, res) => {
//     if (!req.files.image) {
//         return res.status(400).send("no files sended")
//     }
//     let image = req.files.image;
//     let date = new Date()
//     let imageName = date.getTime()+".png"
//     image.mv("./public/" + imageName, (error) => {
//         if (error) return res.status(500).send(error);
//         // res.send("upload success")
//         res.json({ path: "http://localhost:3000/"+imageName })//menampilkan image di front end
//     });

// })

passport.use("auth", new BearerStrategy((token, done) => {
    //     if (token == "1234") {
    //         return done(null, { name: "user 1" });
    //     }

    //     else {
    //         return done("user not authorized", null)
    //     }

    jwt.verify(token, 'secretkey', (error, decoded) => {
        if (error) {
            return done(error, null)
        } else {
            // console.log(decoded);
            return done(null, decoded)
        }
    })
}))

app.use("/api/validatetoken", passport.authenticate("auth", { session: false }),(req,res)=>{
    res.send(req.user)
})

app.post("/data", passport.authenticate("auth", { session: false }), (req, res) => {
    // res.send("berhasil")
    res.json(req.user)
})

app.post("/login", (req, res) => {
    if (req.body.username == "user" && req.body.password == "abc123") {

        const payload = {
            id: "USR10012018",
            name: "user"
        };
        const token = jwt.sign(payload, "secretkey", { expiresIn: 1000 });

        res.json({ token: token })
    }
    else {
        res.status(400).json({ message: "user not found" })
    }
})

app.use("/api/employee", employeeRoutes(passport))
app.use("/api/user", userRoutes(passport))


app.listen(3000);