const mongoose = require("mongoose");

const Task = require("./models/task");


mongoose.connect('mongodb://localhost:27017/ToDoApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("CONNECTION OPEN!")
}).catch(err=>{
    console.log("CONNECTION ISSUE")
    console.log(err);
});


const T = new Task({
    task:"Meeting at noon"
})

T.save().then(t=>{
    console.log(t);
}).catch(e=>{
    console.log(e);
})