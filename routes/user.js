const express = require("express")
const user = require("../models/user")
const router = express.Router();
const jwt = require("jsonwebtoken")



module.exports = function (passport) {
    router.post("/register", (req, res) => {
        let newObj = new user({
            username: req.body.username,
            password: req.body.password
        })
    
        newObj.save((error) => {
            if (error) {
                res.status(500).send(error)
            } else {
                res.json(newObj)
            }
        })
    
    
    })
    
    
    
    
    
    router.post("/login", (req, res) => {
    
        user.findOne({ username: req.body.username, password: req.body.password }, (error, result) => {
            if (error) {
                res.status(500).json(error)
            } else if(!result){
                res.status(404).json({message:"user not found"})
            }
        
            else{
                const payload = {
                    id: result._id,
                    name: result.username
                };
                const token = jwt.sign(payload, 'secretkey', { expiresIn: 100000 })
                res.json({ token: token })
            }
        })
    
    
    
    })
    return router;

}


