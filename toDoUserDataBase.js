const userData = {};
const task = {};

userData.get = function (id) {
  return userData[id];
};

userData.set = function (id, value, task) {
  userData[id] = {
    userName: value.userName,
    password: value.password,
    task: task,
  };
};

userData.delete = function (id) {
  delete userData[id];
};

module.exports = userData;
