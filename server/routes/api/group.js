const User = require("../../models/user");
const DATABASE = require("../../config/index");
const fs = require("fs");

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
    console.log("herer");
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
};
