const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");
const app = express();

//This Code is need to be above from the below 3 lines (required)
//Middelware.............
// app.use((req,res,next)=>{
//     if(req.method=="GET"){
//         res.send("GET method is disabled!");
//     }
//     else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//         res.status(503).send("This site is under maintainance!");
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server is running at ", port);
});

// const bcrypt = require("bcryptjs");
// const myFunc = async ()=>{
//     const password = "Sunay123";
//     const hashedPassword = await bcrypt.hash(password,8);
//      console.log(password);
//      console.log(hashedPassword);
//     const isMatch = await bcrypt.compare("Sunay123",hashedPassword);
//     console.log(isMatch);
// }

// myFunc();

// const jwt = require("jsonwebtoken");
// const myFunc = async ()=>{
//     const token = jwt.sign({_id:12345},"hello",{ expiresIn:"7 days"});
//     console.log(token);
//     const match = jwt.verify(token,"hello");
//     console.log(match);
// }

// myFunc();

// const pet = {
//     name:"hey"
// }

// pet.toJSON = function(){
//     console.log(this)
//     return this
// }

// console.log(pet);
// console.log(JSON.stringify(pet));

// const User = require("./models/user.js");
// // const Task = require("./models/task.js");
// const newFunc = async () => {
//     // const task = await Task.findById("650314cd2fea6af27f1f5cba");
//     // await task.populate('owner');
//     // console.log(task.owner);

//     const user = await User.findById("6503fd292a4d29386a414480");
//     await user.populate("tasks");
//     console.log(user.tasks);
// }

// newFunc()

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please provide a word document file"));
//     }
//     cb(undefined, true);
//   },
// });

//for Demo Purpose...............................................................................................
// const errorMiddleware = (req, res, next) => {
//   throw new Error("from my middleware");
// };

//setting up file uploads endpoint with size and type filteration............................................................
// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   //for Error Handling need to do following with same arguments as below,.................................................
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );
