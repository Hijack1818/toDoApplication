const userData = {};
// const task = {};

userData.get = function (id) {
  return userData[id];
};

userData.set = function (id, value, task) {

  if(userData[id]){
    userData[id].task.push(task);
    return;
  }

  userData[id] = {
    userName: value.userName,
    password: value.password,
    task: [],
  };
};

userData.delete = function (id) {
  delete userData[id];
};

module.exports = userData;
