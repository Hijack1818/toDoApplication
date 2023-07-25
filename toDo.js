const express = require("express");
const app = express();
const dataBase = require("./toDoDataBase");
const userData = require("./toDoUserDataBase");

app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + "/toDo.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/toDoLogin.html");
});

app.post("/addTask", (req, res) => {
  if (req.body.taskTitle === "" || dataBase.getTask(req.body.taskTitle)) {
    res.json({ message: "title already taken", status: 400 });
    return;
  }
  let rt = dataBase.addTask(
    req.body.taskTitle,
    req.body.taskDetails,
    req.body.taskStatus,
    req.body.taskPriority
  );
  res.json({ message: "task added successfully", status: 200 });
});

app.post("/updateTaskStatus", (req, res) => {
  dataBase.updateTaskStatus(req.body.taskTitle);
  res.json({ message: "task status updated", status: 200 });
});

app.post("/deleteTask", (req, res) => {
  dataBase.deleteTask(req.body.taskTitle);
  res.json({ message: "task deleted", status: 200 });
});

app.post("/login", (req, res) => {
  let rt = userData.get(req.body.userName);
  if (rt) {
    if (rt.password === req.body.password) {
      res.json({ message: "user logged in", status: 200, task: rt.task });
    } else {
      res.json({ message: "password incorrect", status: 400 });
    }
  } else {
    res.json({ message: "user not found", status: 400 });
  }
});

app.post("/register", (req, res) => {
  let rt = userData.get(req.body.userName);
  if (rt) {
    res.json({ message: "user already exists", status: 400 });
  } else {
    // console.log(rt.password, rt.userName);
    if (req.body.password !== req.body.confirmPassword) {
      res.json({ message: "passwords do not match", status: 400 });
    }
    userData.set(req.body.userName, req.body);
    res.json({ message: "user registered", status: 200 });
  }
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});
