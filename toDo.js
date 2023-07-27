const express = require("express");
const app = express();
const dataBase = require("./toDoDataBase");
const userData = require("./toDoUserDataBase");
const session = require("express-session");
const fs = require("fs");

app.use(express.json());

//session
app.use(
  session({
    secret: "qwer1234",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  // console.log(req.session.userName);

  fs.readFile(__dirname + "/toDo.html", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
    let modifiedData = data.replace("%User%", req.session.userName);

    // console.log(userData[req.session.userName].task);

    // let addedTask =
    //   '<div class="task-item"><div class="task-title">shivam</div><div class="task-priority">Priority: high</div><div class="task-details">ajsdklf</div><button class="task-delete" onclick="deleteTask(this)">Delete</button><button class="task-done" onclick="markDone(this)">Mark as Done</button></div>';

    let emptyString = "";

    userData[req.session.userName].task.forEach((task) => {
      let addedTask = `<div class="task-item"><div class="task-title">${task.taskTitle}</div><div class="task-priority">Priority: ${task.data.taskPriority}</div><div class="task-details">${task.data.taskDetails}</div><button class="task-delete" onclick="deleteTask(this)">Delete</button><button class="task-done" onclick="markDone(this)">Mark as Done</button></div>`;
      emptyString += addedTask;
      console.log(task);
    });

    let finalData = modifiedData.replace(
      '<div id="taskList">',
      '<div id="taskList">' + emptyString
    );

    res.send(finalData);
  });
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
  userData[req.session.userName].task.push(rt);
  res.json({ message: "task added successfully", status: 200 });
});

app.post("/updateTaskStatus", (req, res) => {
  dataBase.updateTaskStatus(req.body.taskTitle);
  res.json({ message: "task status updated", status: 200 });
});

app.post("/deleteTask", (req, res) => {
  dataBase.deleteTask(req.body.taskTitle);
  userData[req.session.userName].task.forEach((it) => {
    if (req.body.taskTitle === it.taskTitle) {
      userData[req.session.userName].task.splice(
        userData[req.session.userName].task.indexOf(it),
        1
      );
      // return;
    }
  });
  res.json({ message: "task deleted", status: 200 });
});

app.post("/login", (req, res) => {
  let rt = userData.get(req.body.userName);
  if (rt) {
    if (rt.password === req.body.password) {
      req.session.isLoggedIn = true;
      req.session.userName = req.body.userName;
      res.json({ message: "user logged in", status: 200 });
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

app.post("/logout", (req, res) => {
  req.session.isLoggedIn = false;
  req.session.userName = null;
  res.json({ message: "user logged out", status: 200 });
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});
