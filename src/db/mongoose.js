const mongoose = require("mongoose");
// const validator = require("validator");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  // useCreateIndex: true
});

// const me = new User({
//     name: "     sunay      ",
//     email:"SUNAY@GMAIL.COM   ",
//     password:"heyy12718"
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log("Error!" + error);
// })

// const task1 = new Task({
//     description:"     Meeting         hey     ",
// })

// task1.save().then(()=>{
//     console.log(task1);
// }).catch((error)=>{
//     console.log("There is Error! "+error);
// })
