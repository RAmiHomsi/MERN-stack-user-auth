const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


app.use(express.json());

const cors = require("cors")
app.use(cors())

const mongoose = require("mongoose")
const UserModel = require("./models/Users")
const AdminModel = require("./models/Admins")


mongoose.connect('mongodb://localhost:27017/mernproject', {useNewUrlParser: true}
).then(() =>{
    console.log("connected sucessfully to db");
}).then(() =>{
  app.listen(3001, () => {
    console.log("Server is running at port 3001");
  });
}).catch(err =>{
  console.error(err);
})




app.post("/createUser", async (req, res) => {
  const newUser = new UserModel(req.body);

  await newUser.save();
  res.json(req.body)

    
});


app.get("/users", async (request, response) => {
  const users = await UserModel.find();

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});


/*-----------------Admin-----------*/

app.post("/register", async (req,res) =>{
  const {username, password} = req.body;
  const admin = await AdminModel.findOne({username});

  
    admin && res.json({msg: "already exists"});
  

  const hashedPass = bcrypt.hashSync(password , 10);

  const newAdmin = new AdminModel({
    username: username,
    password: hashedPass
  });

  await newAdmin.save();

  return res.status(200).json({
    status: 'success',
    data: newAdmin
  });
})

app.post("/login", async (req,res) =>{
  const {username, password} = req.body;
  const admin = await AdminModel.findOne({username});
  
  !admin && res.json({msg: "dosen't exists"});
  

  const isPassValid =  await bcrypt.compare(password , admin.password);

  !isPassValid && res.json({msg: "username or pass is incorrect"});

  var token = jwt.sign({ id: admin._id }, 'secret');


  return res.status(200).json({
    status: 'success',
    token, 
    adminID: admin._id

  });
})