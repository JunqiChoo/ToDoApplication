const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Task = require("./models/task");
const methodOverride = require('method-override');
//connecting to the mongoose db
mongoose.connect('mongodb://localhost:27017/ToDoApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("CONNECTION OPEN!")
}).catch(err=>{
    console.log("CONNECTION ISSUE")
    console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

app.get("/main",async (req,res)=>{
    //find all the task and display it
    const ListOftask = await Task.find({});
    res.render("main",{ListOftask});
})

app.post("/main",async(req,res)=>{
    const userinput = req.body.task;
    const task = new Task({task:userinput});
    await task.save();
    //add the user task into the database from here
    res.redirect("/main");
})

app.delete("/main/:id",async(req,res)=>{
    //getting the id from the params
    const {id} = req.params;
    //delete the task
    const DeleteTask = await Task.findByIdAndDelete(id);
    res.redirect("/main");

})

app.listen(port,()=>{
    console.log(`Listening on port ${port}.............`);
})





