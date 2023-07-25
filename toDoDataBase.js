dataBase = {};

function getTask(taskTitle) {
  return dataBase[taskTitle];
}

function addTask(taskTitle, taskDetails, taskStatus, taskPriority) {
  let data = {
    taskDetails: taskDetails,
    taskStatus: taskStatus,
    taskPriority: taskPriority,
  };

  dataBase[taskTitle] = data;
  return { taskTitle, data };
}

function updateTaskStatus(taskTitle) {
  dataBase[taskTitle].taskStatus = true;
}

function deleteTask(taskTitle) {
  delete dataBase[taskTitle];
}

module.exports = {
  getTask,
  addTask,
  updateTaskStatus,
  deleteTask,
};
