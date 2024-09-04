const User = require("../../models/user");
const DATABASE = require("../../config/index");
const fs = require("fs");
const Group = require("../../models/group");

module.exports = {
  getAll: (req, res) => {
    let isAdmin;
    let groupsArray = [];

    const UUID = req.body.data;
    // console.log(req.body);
    fs.readFile(DATABASE.USERS_DB, "utf-8", function (error, data) {
      if (error) throw error;
      let userArr = JSON.parse(data);
      // console.log(userArr);

      let i = userArr.findIndex((user) => user.UUID === +UUID);
      if (i === -1) {
        res.send({ valid: false });
      } else {
        // console.log(userArr[i]);
        if (userArr[i].roles.includes("SUPERADMIN")) {
          // console.log("All groups");
          isAdmin = true;
        } else {
          groupsArray = userArr[i].groups;
          // console.log(groupsArray, "groups");
        }
        fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
          if (isAdmin) {
            // console.log("sending all groups");
            res.send(data);
          } else {
            let groupsDB = JSON.parse(data);
            // console.log(groupsDB, "groups db");

            const returnArray = groupsDB.filter((group) =>
              group.users.includes(UUID)
            );
            // console.log(returnArray);
            res.send(JSON.stringify(returnArray));
          }
        });
      }
    });
  },
  getAllID: (req, res) => {
    fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
      let allGroups = JSON.parse(data);
      // console.log(allGroups, "all groups");
      const filtered = allGroups.map((group) => {
        return {
          UUID: group.UUID,
          name: group.name,
        };
      });
      res.send(JSON.stringify(filtered));
    });
  },
  assignUserToGroup: (req, res) => {
    const { userID, groupID } = req.body;
    fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
      let allGroups = JSON.parse(data);

      let i = allGroups.findIndex((group) => group.UUID === groupID);
      if (i === -1) {
        console.log("error");
      }
      allGroups[i].users.push(userID);
    });
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === userID);
      if (j === -1) {
        console.log("error");
      }
      allUsers[j].groups.push(groupID);
    });
    res.send("someshit");
  },
  createNewGroup: (req, res) => {
    const { userID, name } = req.body;
    console.log(userID);
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +userID);
      if (j === -1) {
        console.log("error");
      }
      console.log(allUsers[j]);
      if (allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let newGroup = new Group(name, allGroups.length + 1);
          allGroups.push(newGroup);
          const stringifiedFile = JSON.stringify(allGroups);
          fs.writeFile(DATABASE.GROUPS_DB, stringifiedFile, "utf-8", (error) =>
            console.log(error)
          );
          res.send(stringifiedFile);
        });
      } else res.send({ error: "Not Authenticated" });
    });
  },
};
