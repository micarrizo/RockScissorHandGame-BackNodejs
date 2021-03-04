const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "./public/assets/uploads/", 
    filename: function(req, file, cb){
       cb(null,file.originalname);
    }
 });
 
 const upload = multer({storage});

 router.post('/upload', upload.single('file'), async (req, res) => {
     const img = req.file
     console.log(img) 
     res.status(200).send(req.file)
 });
 
//  router.post("/upload", (req, res) => {
//         upload(req.body.path);
//     }
//  )

module.exports = router;