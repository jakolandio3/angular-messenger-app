const User = require("../../models/user");
const DATABASE = require("../../config/index");
const fs = require("fs");

module.exports = {
  GetByID: function (req, res) {
    const userID = req.body.data;
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      let i = userArr.findIndex((user) => user.UUID === +userID);
      if (i === -1) {
        res.send({ error: "No User Found" });
      } else {
        const usersName = userArr[i].username;
        res.send(JSON.stringify(usersName));
      }
    });
  },
  GetAllUsers: function (req, res) {
    const userID = req.body.data;
    const allUsersList = [];
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      let i = userArr.findIndex((user) => user.UUID === +userID);
      if (i === -1) {
        res.send({ error: "Not Authorized User" });
      } else {
        const curUser = userArr[i];
        if (!curUser.roles.includes("SUPERADMIN")) {
          res.send({ error: "User Not Authorized" });
        } else {
          for (let i = 0; i < userArr.length; i++) {
            let userData = { name: userArr[i].username, UUID: userArr[i].UUID };
            allUsersList.push(userData);
          }
          res.send(JSON.stringify(allUsersList));
        }
      }
    });
  },
  Login: function (req, res) {
    const { email, pwd } = req.body;
    console.log(req.body);
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      console.log(userArr);

      let i = userArr.findIndex(
        (user) => user.password === pwd && user.email === email
      );
      if (i === -1) {
        res.send({ valid: false });
      } else {
        userArr[i].valid = true;
        console.log(userArr[i]);
        const { username, email, valid, UUID, roles, groups } = userArr[i];
        let validUserObj = {
          username,
          email,
          valid,
          UUID,
          roles,
          groups,
        };
        // console.log(validUserObj, "new");
        res.send(JSON.stringify(validUserObj));
        const stringifiedUsers = JSON.stringify(userArr);
        fs.writeFile(
          DATABASE.USERS_DB,
          stringifiedUsers,
          "utf-8",
          function (err) {
            if (err) throw err;
          }
        );
      }
    });
  },
  Logout: (req, res) => {
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      console.log(userArr);

      let i = userArr.findIndex((user) => user.UUID === Number(req.body.data));
      if (i === -1) {
        res.send({ error: "ID cant be found" });
      } else {
        userArr[i].valid = false;

        res.send({ message: "Logged Out Sucessfuly" });
        const stringifiedUsers = JSON.stringify(userArr);
        fs.writeFile(
          DATABASE.USERS_DB,
          stringifiedUsers,
          "utf-8",
          function (err) {
            if (err) throw err;
          }
        );
      }
    });
  },
  Update: (req, res) => {
    if (!req.body.UUID) {
      res.send({ error: "NO ID" });
    }
    console.log(req.body);
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      // console.log(userArr);

      let i = userArr.findIndex((user) => user.UUID === req.body.UUID);
      if (i === -1) {
        res.send({ error: "ID cant be found" });
      } else {
        userArr[i] = { ...userArr[i], ...req.body };
        const { username, email, valid, UUID, roles, groups } = userArr[i];
        let validUserObj = {
          username,
          email,
          valid,
          UUID,
          roles,
          groups,
        };
        console.log(validUserObj, "new");
        res.send(JSON.stringify(validUserObj));
        const stringifiedUsers = JSON.stringify(userArr);
        fs.writeFile(
          DATABASE.USERS_DB,
          stringifiedUsers,
          "utf-8",
          function (err) {
            if (err) throw err;
          }
        );
      }
    });
  },
  CreateUser: (req, res) => {
    const { email, pwd } = req.body;
    console.log(req.body);
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      console.log(userArr);

      let i = userArr.findIndex((user) => user.email === email);
      if (i !== -1) {
        res.send({ error: "User Already Exists" });
      } else {
        let newUser = new User(email, email, pwd, userArr.length + 1);
        userArr.push(newUser);
        console.log(newUser, "new");
        res.send(JSON.stringify(newUser));
        const stringifiedUsers = JSON.stringify(userArr);
        fs.writeFile(
          DATABASE.USERS_DB,
          stringifiedUsers,
          "utf-8",
          function (err) {
            if (err) throw err;
          }
        );
      }
    });
  },
  Delete: (req, res) => {
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      console.log(userArr);

      let i = userArr.findIndex((user) => user.UUID === Number(req.body.data));
      if (i === -1) {
        res.send({ error: "ID cant be found" });
      } else {
        let newArr = userArr.splice(i, 1);

        res.send({ message: "Deleted User" });
        const stringifiedUsers = JSON.stringify(userArr);
        fs.writeFile(
          DATABASE.USERS_DB,
          stringifiedUsers,
          "utf-8",
          function (err) {
            if (err) throw err;
          }
        );
      }
    });
  },
};
