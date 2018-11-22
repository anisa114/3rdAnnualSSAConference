var mongoose=require("mongoose"),
    bodyParser  =require("body-parser"),
    express     =require("express"),
    app         =express(),
    nodemailer = require('nodemailer');
    
    
    
process.env.NODE_ENV === 'development';

require('dotenv').config()
mongoose.connect("mongodb://localhost/ssa_app", {useNewUrlParser:true});
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


var ticketSchema=new mongoose.Schema({
    
    first:String,
    last:String,
    school:String,
    major:String,
    email:String,
    number:Number
});

var Ticket=mongoose.model("Ticket", ticketSchema);
  
app.get("/", function(req, res) {
    res.render("home");
});

app.get("/about", function(req, res) {
    res.render("about");
});
app.get("/schools", function(req, res) {
    res.render("schools");
});
app.get("/ticket/new", function(req, res) {
    res.render("ticket");
});
app.post("/paypal", function(req, res) {
    
    Ticket.create(req.body.ticket, function(err,newticket){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/paypal");
        }
    });
  
});

// //INDEX

app.get("/ticket", function(req, res) {
    Ticket.find({}, function(err,tickets){
        if(err){
            console.log(err)
        }
        else{
              res.render("index",{tickets:tickets});
        }
    });
})

app.get("/paypal", function(req, res) {
    res.render("paypal");
});
app.get("/donate", function(req, res) {
    res.render("donate");
});
// POST route from contact form
app.post('/about', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  mailOpts = {
    from: `${req.body.email}`,

    replyTo:`${req.body.email}`,
    to: process.env.GMAIL_USER,
    subject: 'New message from Comment form at SSA',
    text: `${req.body.first} ${req.body.last}(${req.body.email}) says: ${req.body.comment}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
        console.log(error);
      console.log("Did not WORK");
    }
    else {
      console.log("Email Sent");
      
    }
  });
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SSA WEB started");
    
});