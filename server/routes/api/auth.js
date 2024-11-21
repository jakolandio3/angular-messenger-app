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
        return res.send(JSON.stringify(usersName));
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
        return res.send({ error: "ID cant be found" });
      }
      let newArr = userArr.splice(i, 1);
      const stringifiedUsers = JSON.stringify(userArr);
      fs.writeFile(
        DATABASE.USERS_DB,
        stringifiedUsers,
        "utf-8",
        function (err) {
          if (err) throw err;
        }
      );
      fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
        // write a matrix nested for'i' code to remove user from each group its in
        let allGroups = JSON.parse(data);
        for (let j = 0; j < allGroups.length; i++) {
          let currUsers = allGroups[j].users;
          let filteredUsers = currUsers.filter((u) => u !== +req.body.data);
          allGroups[j].users = filteredUsers;
        }
        fs.writeFile(
          DATABASE.GROUPS_DB,
          JSON.stringify(allGroups),
          "utf-8",
          (e) => console.log(e)
        );
        return res.send(
          JSON.stringify({
            ok: true,
            message: "User Has been removed from database",
          })
        );
      });
    });
  },
  AdminDelete: (req, res) => {
    const { adminID, userID } = req.body;
    console.log(adminID, userID);
    return fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      console.log(userArr);

      let a = userArr.findIndex((user) => user.UUID === Number(adminID));
      if (a === -1) {
        return res.send({ error: "ID cant be found" });
      }
      if (!userArr[a]?.roles.includes("SUPERADMIN")) {
        return res.send({ error: "Unauthorized action" });
      }
      let i = userArr.findIndex((user) => user.UUID === Number(userID));
      if (i === -1) {
        return res.send({ error: "ID cant be found" });
      }
      userArr.splice(i, 1);
      console.log(`USERARRAY`, userArr);

      fs.writeFile(
        DATABASE.USERS_DB,
        JSON.stringify(userArr),
        "utf-8",
        function (err) {
          console.log(err);
          if (err) throw err;
        }
      );
      fs.readFile(DATABASE.GROUPS_DB, "utf-8", function (error, data) {
        // write a matrix nested for'i' code to remove user from each group its in

        console.log(error);
        console.log("has reached groups database");
        let allGroups = JSON.parse(data);
        console.log(allGroups);

        for (let j = 0; j < allGroups.length; j++) {
          let currUsers = allGroups[j].users;
          let filteredUsers = currUsers.findIndex((u) => u === userID);
          allGroups[j].users.splice(filteredUsers, 1);
          console.log(j, "get clogged");
        }
        fs.writeFile(
          DATABASE.GROUPS_DB,
          JSON.stringify(allGroups),
          "utf-8",
          (e) => console.log(e)
        );
        console.log("has reached end");
        return res.send(
          JSON.stringify({
            ok: true,
            message: "User Has been removed from database",
          })
        );
      });
    });
  },

  AdminCreateSuper: (req, res) => {
    const { adminID, userID } = req.body;
    console.log(adminID, userID);
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      console.log(userArr);

      let a = userArr.findIndex((user) => user.UUID === Number(adminID));
      if (a === -1) {
        return res.send({ error: "ID cant be found" });
      }
      if (!userArr[a]?.roles.includes("SUPERADMIN")) {
        return res.send({ error: "Unauthorized action" });
      }
      let i = userArr.findIndex((user) => user.UUID === Number(userID));
      if (i === -1) {
        return res.send({ error: "ID cant be found" });
      }
      if (userArr[i].roles.includes("SUPERADMIN")) {
        return res.send(
          JSON.stringify({ error: "User is already SUPERADMIN" })
        );
      }
      userArr[i].roles.push("SUPERADMIN");
      const stringifiedUsers = JSON.stringify(userArr);
      fs.writeFile(
        DATABASE.USERS_DB,
        stringifiedUsers,
        "utf-8",
        function (err) {
          if (err) throw err;
        }
      );
      return res.send(
        JSON.stringify({
          ok: true,
          message: `User: ${userID} '${userArr[i]?.username}' Has been Promoted to SUPERADMIN`,
        })
      );
    });
  },
};
