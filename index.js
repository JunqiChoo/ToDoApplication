
if(process.env.NODE_ENV !=="production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();

const path = require("path");
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Task = require("./models/task");
const methodOverride = require('method-override');
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');
//for the flash messages

const DB_URL = process.env.DB_URL||'mongodb://localhost:27017/ToDoApp';
const secret = process.env.SECRET || "thisismysecret";
//'mongodb://localhost:27017/ToDoApp'
//connecting to the mongoose db
mongoose.connect(DB_URL,
 {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false})
.then(()=>{
    console.log("CONNECTION OPEN!")
}).catch(err=>{
    console.log("CONNECTION ISSUE")
    console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
//for the flash messages


const store = new MongoStore({
    mongoUrl:DB_URL,
    secret:secret,
    touchAfter:24*3600
});


store.on("error",function(e){
    console.log("session store error",e)
})

const sessionconfig = {
    store,
    name:"session",
    secret:secret,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7
    }
}
app.use(session(sessionconfig))
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})



app.get("/",(req,res)=>{
    res.redirect("/main")
})

app.get("/main",async (req,res)=>{
    //find all the task and display it
    const ListOftask = await Task.find({});
    res.render("main",{ListOftask});
})

app.post("/main",async(req,res)=>{
    const userinput = req.body.task;
    const task = new Task({task:userinput});
    await task.save();
    await req.flash("success","successfully added a new task");
    //add the user task into the database from here
    res.redirect("/main");
})

app.delete("/main/:id",async(req,res)=>{
    //getting the id from the params
    const {id} = req.params;
    //delete the task
    const DeleteTask = await Task.findByIdAndDelete(id);
    await req.flash("success","successfully deleted the task");
    res.redirect("/main");
})

app.get("/main/edit/:id",async(req,res)=>{
    const {id} = req.params;
    //find the task here
    const Selectedtask = await Task.findById(id);
    res.render("edit",{Selectedtask})
})

app.post("/main/edit/:id",async(req,res)=>{
    const {id} = req.params;
    const {task} = req.body;
    const Selectedtask = await Task.findByIdAndUpdate(id,{task:task})
    await req.flash("success","successfully edited task");
    res.redirect("/main");
})

//handle 404 errors
app.use((req,res,next)=>{
    res.status(404);
    res.render("error", {errorType: 404,errorMsg:`Please Enter Correct URL Link to the application.`});
})

//handle 500 error
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500);
    res.render("error",{errorType: 500, errorMsg:err});
})
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}.............`);
})





