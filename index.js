const express = require("express")
const app = express();
const Path = require("path");
const fs = require('fs');



console.log(__dirname+'/public');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(Path.join(__dirname,'public')))
app.set('view engine', 'ejs');
app.get('/ok',function(req,res){
    res.render("index");
})
//main route..
app.get('/',function(req,res){
    //read data from folder --Files..
    fs.readdir(`./Files`,function(err,Files){
        console.log(Files);
        res.render("index",{Files:Files});
    })
})
//form handling..
app.post('/create', function(req,res){
    fs.writeFile(`./Files/${req.body.title.split('').join('')}.txt`,req.body.details, function(err){
        res.redirect('/');
    })
    console.log(req.body);
})
// //Read-more  section for getting re-direct to that file...
// app.get('/file/:filename',function(req,res){
//     fs.readFile(`/Files/${req.params.filename}`, "utf-8",function(err,Filedata){
//         console.log(Filedata);
//        res.render("show",{filename:req.params.filename, Filedata: Filedata})
//     })
// })
//----------->Read-more  section for getting re-direct to that file...
app.get('/file/:filename', function(req, res) {
    const filePath = `./Files/${req.params.filename}`;
    console.log("Reading file from:", filePath); // Log the file path
    fs.readFile(filePath, "utf-8", function(err, Filedata) {
        if (err) {
            console.error("Error reading file:", err); // Log any error
            return res.status(500).send('Error reading file.');
        }
        console.log("File data:", Filedata); // Log the file content
        res.render("show", { filename: req.params.filename, Filedata: Filedata });
    });
});
//for sending previous filename-- File name-->
app.get('/edit/:filename', function(req, res) {
    res.render("Edit",{filename:req.params.filename})
});
//edit file name--->
app.post('/edit',function(req,res){
    console.log(req.body.previous);
    fs.rename(`./Files/${req.body.previous}`,`./Files/${req.body.newname}`,function(err){
        if(err){
            res.send(err);
        }else{
            res.redirect('/');
        }
    })
    if (!req.body.details) {
        return res.status(400).send('Details are missing.');
    }
    
})
app.get('/check', function(req, res) {
    res.write('Hello, this is a test response!'); // You can send a response here.
    res.end(); // Ends the response.
});

const PORT = 8000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
