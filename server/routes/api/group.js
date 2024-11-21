const User = require("../../models/user");
const DATABASE = require("../../config/index");
const fs = require("fs");
const Group = require("../../models/group");
const Channel = require("../../models/channel");

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
  getGroupByID: (req, res) => {
    const UUID = req.body.data;
    fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
      let allGroups = JSON.parse(data);
      // console.log(allGroups, "all groups");
      const filtered = allGroups.filter((group) => {
        return group.UUID === UUID;
      });
      res.send(JSON.stringify(filtered));
    });
  },

  assignUserToGroup: (req, res) => {
    const { adminID, userID, groupID } = req.body;
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +adminID);
      if (j === -1) {
        console.log("no user found");
        res.send(JSON.stringify({ error: "No account for Admin found" }));
      }
      let k = allUsers.findIndex((user) => user.UUID === +userID);
      if (k === -1) {
        console.log("no user found");
        res.send(JSON.stringify({ error: "No account for User found" }));
      } else {
        if (!allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
          res.send(
            JSON.stringify({ error: "Not Authorized to perform this action" })
          );
        } else {
          fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
            let allGroups = JSON.parse(data);
            let i = allGroups.findIndex((group) => group.UUID === +groupID);
            if (i === -1) {
              console.log("error group not found");
              res.send(JSON.stringify({ error: "Group ID Not Found" }));
            } else {
              let r = allGroups[i].requests.findIndex(
                (req) => req.UUID === +userID
              );
              if (r === -1 && !allUsers[j].roles.includes("SUPERADMIN")) {
                res.send({ error: "User request was not found" });
              } else {
                if (allUsers[j].roles.includes("SUPERADMIN")) {
                  if (allGroups[i].users.includes(userID)) {
                    return res.send({ error: "User already exists in group" });
                  }
                  allGroups[i].users.push(userID);
                  allGroups[i].requests.splice(r, 1);
                  const stringifiedFile = JSON.stringify(allGroups);
                  fs.writeFile(
                    DATABASE.GROUPS_DB,
                    stringifiedFile,
                    "utf-8",
                    (error) => console.log(error)
                  );
                  res.send(
                    JSON.stringify({
                      ok: true,
                      message: `User: ${userID} has been added to Group: ${groupID} Successfully`,
                    })
                  );
                } else if (
                  allUsers[j].roles.includes("USERADMIN" && !"SUPERADMIN")
                ) {
                  if (!allGroups[i].admins.includes(adminID)) {
                    res.send(JSON.stringify({ error: "Not Group ADMIN" }));
                  } else {
                    allGroups[i].users.push(userID);
                    allGroups[i].requests.splice(r, 1);

                    const stringifiedFile = JSON.stringify(allGroups);
                    fs.writeFile(
                      DATABASE.GROUPS_DB,
                      stringifiedFile,
                      "utf-8",
                      (error) => console.log(error)
                    );

                    res.send(
                      JSON.stringify({
                        ok: true,
                        message: `User: ${userID} has been added to Group: ${groupID} Successfully`,
                      })
                    );
                  }
                }
              }
            }
          });
        }
      }
    });
  },
  updateUserGroupRoles: (req, res) => {
    const { adminID, userID, groupID, action } = req.body;
    if (!action) {
      res.send(JSON.stringify({ error: "No Action Type found" }));
    }
    switch (action) {
      default:
        return res.send(JSON.stringify({ error: "No Action Type found" }));
      case "REMOVE":
        return fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
          let allUsers = JSON.parse(data);
          let j = allUsers.findIndex((user) => user.UUID === +adminID);
          if (j === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for Admin found" })
            );
          }
          let k = allUsers.findIndex((user) => user.UUID === +userID);
          if (k === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for User found" })
            );
          }
          if (!allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
            return res.send(
              JSON.stringify({ error: "Not Authorized to perform this action" })
            );
          }
          fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
            let allGroups = JSON.parse(data);
            let g = allGroups.findIndex((group) => group.UUID === +groupID);
            if (
              allUsers[j].roles.includes("SUPERADMIN") ||
              allGroups[g].admins.includes(adminID)
            ) {
              let newUsers = allGroups[g].users.filter(
                (user) => user !== userID
              );
              allGroups[g].users = newUsers;
              let newAdmins = allGroups[g].admins.filter(
                (user) => user !== userID
              );
              allGroups[g].admins = newAdmins;
              fs.writeFile(
                DATABASE.GROUPS_DB,
                JSON.stringify(allGroups),
                "utf-8",
                (error) => console.log(error)
              );
              return res.send(
                JSON.stringify({
                  ok: true,
                  message: `User: ${userID} successfully removed from Group: ${groupID}`,
                })
              );
            } else return res.send({ error: "User does not have permisssion" });
          });
        });
      case "BAN":
        return fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
          let allUsers = JSON.parse(data);
          let j = allUsers.findIndex((user) => user.UUID === +adminID);
          if (j === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for Admin found" })
            );
          }
          let k = allUsers.findIndex((user) => user.UUID === +userID);
          if (k === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for User found" })
            );
          }
          if (!allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
            return res.send(
              JSON.stringify({ error: "Not Authorized to perform this action" })
            );
          }
          fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
            let allGroups = JSON.parse(data);
            let g = allGroups.findIndex((group) => group.UUID === +groupID);
            if (
              allUsers[j].roles.includes("SUPERADMIN") ||
              allGroups[g].admins.includes(adminID)
            ) {
              let newUsers = allGroups[g].users.filter(
                (user) => user !== userID
              );
              allGroups[g].users = newUsers;
              let newAdmins = allGroups[g].admins.filter(
                (user) => user !== userID
              );
              allGroups[g].admins = newAdmins;
              allGroups[g].banList.push(userID);
              fs.writeFile(
                DATABASE.GROUPS_DB,
                JSON.stringify(allGroups),
                "utf-8",
                (error) => console.log(error)
              );
              return res.send(
                JSON.stringify({
                  ok: true,
                  message: `User: ${userID} successfully banned from Group: ${groupID}`,
                })
              );
            } else return res.send({ error: "User does not have permisssion" });
          });
        });
      case "PROMOTE":
        return fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
          let allUsers = JSON.parse(data);
          let j = allUsers.findIndex((user) => user.UUID === +adminID);
          if (j === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for Admin found" })
            );
          }
          let k = allUsers.findIndex((user) => user.UUID === +userID);
          if (k === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for User found" })
            );
          }
          if (!allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
            return res.send(
              JSON.stringify({
                error: "Not Authorized to perform this action",
              })
            );
          }
          fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
            let allGroups = JSON.parse(data);
            let g = allGroups.findIndex((group) => group.UUID === +groupID);
            if (
              allUsers[j].roles.includes("SUPERADMIN") ||
              allGroups[g].admins.includes(adminID)
            ) {
              if (allGroups[g].admins.includes(userID)) {
                return res.send(
                  JSON.stringify({ error: "this user is already an admin" })
                );
              }
              if (!allUsers[k].roles.includes("USERADMIN")) {
                allUsers[k].roles.push("USERADMIN");
                fs.writeFile(
                  DATABASE.USERS_DB,
                  JSON.stringify(allUsers),
                  "utf-8",
                  (error) => console.log(error)
                );
              }
              allGroups[g].admins.push(userID);
              fs.writeFile(
                DATABASE.GROUPS_DB,
                JSON.stringify(allGroups),
                "utf-8",
                (error) => console.log(error)
              );
              return res.send(
                JSON.stringify({
                  ok: true,
                  message: `User: ${userID} successfully Promoted in Group: ${groupID}`,
                })
              );
            } else return res.send({ error: "User does not have permission" });
          });
        });
      case "DEMOTE":
        return fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
          let allUsers = JSON.parse(data);
          let j = allUsers.findIndex((user) => user.UUID === +adminID);
          if (j === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for Admin found" })
            );
          }
          let k = allUsers.findIndex((user) => user.UUID === +userID);
          if (k === -1) {
            console.log("no user found");
            return res.send(
              JSON.stringify({ error: "No account for User found" })
            );
          }
          if (!allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
            return res.send(
              JSON.stringify({
                error: "Not Authorized to perform this action",
              })
            );
          }
          fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
            let allGroups = JSON.parse(data);
            let g = allGroups.findIndex((group) => group.UUID === +groupID);
            if (
              allUsers[j].roles.includes("SUPERADMIN") ||
              allGroups[g].admins.includes(adminID)
            ) {
              if (!allGroups[g].admins.includes(userID)) {
                return res.send(
                  JSON.stringify({ error: "this user is not an admin" })
                );
              }
              let newAdmins = allGroups[g].admins.filter(
                (admins) => admins !== userID
              );
              allGroups[g].admins = newAdmins;
              fs.writeFile(
                DATABASE.GROUPS_DB,
                JSON.stringify(allGroups),
                "utf-8",
                (error) => console.log(error)
              );
              return res.send(
                JSON.stringify({
                  ok: true,
                  message: `User: ${userID} was demoted in Group: ${groupID}`,
                })
              );
            } else return res.send({ error: "User does not have permission" });
          });
        });
    }
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
          newGroup.admins.push(userID);
          newGroup.users.push(userID);
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
  deleteGroupByID: (req, res) => {
    const { userID, groupUUID } = req.body;
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +userID);
      if (j === -1) {
        console.log("error");
      }
      // console.log(allUsers[j]);
      if (allUsers[j].roles.includes("SUPERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let currentGroup = allGroups.findIndex((g) => g.UUID === +groupUUID);
          fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
            let allChannels = JSON.parse(data);
            let filtered = allChannels.filter(
              (ch) => ch.groupUUID !== +groupUUID
            );
            console.log(filtered, "filtered");
            fs.writeFile(
              DATABASE.CHANNELS_DB,
              JSON.stringify(filtered),
              "utf-8",
              (error) => console.log(error)
            );
            let newGroups = allGroups.splice(currentGroup, 1);
            fs.writeFile(
              DATABASE.GROUPS_DB,
              JSON.stringify(allGroups),
              "utf-8",
              (error) => console.log(error)
            );
          });
        });
        res.send({ msg: "hemlo" });
      } else if (allUsers[j].roles.includes("USERADMIN" && !"SUPERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let currentGroup = allGroups.findIndex((g) => g.UUID === +groupUUID);
          if (!allGroups[currentGroup].admins.includes(userID)) {
            res.send({ error: "Not Authenticated" });
          } else {
            fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
              let allChannels = JSON.parse(data);
              let filtered = allChannels.filter(
                (ch) => ch.groupUUID !== +groupUUID
              );
              console.log(filtered);
              fs.writeFile(
                DATABASE.CHANNELS_DB,
                JSON.stringify(filtered),
                "utf-8",
                (error) => console.log(error)
              );
              let newGroups = allGroups.splice(currentGroup, 1);
              fs.writeFile(
                DATABASE.GROUPS_DB,
                JSON.stringify(newGroups),
                "utf-8",
                (error) => console.log(error)
              );
            });
          }

          res.send("Group Deleted");
        });
        res.send({ msg: "hemlo" });
      } else res.send({ error: "Not Authenticated" });
    });
  },
  getAllChannelsByGroupUUID: (req, res) => {
    const { userID, groupUUID } = req.body;
    console.log(userID);
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +userID);
      if (j === -1) {
        console.log("error user does not exist");
      }
      console.log(allUsers[j]);
      if (allUsers[j].roles.includes("SUPERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let currentGroup = allGroups.findIndex((g) => g.UUID === +groupUUID);
          if (allGroups[currentGroup]?.channels.length < 1) {
            res.send({ error: "No Channels in Group" });
          } else {
            fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
              let allChannels = JSON.parse(data);
              console.log(groupUUID);
              console.log(allChannels);
              let groupsChannels = allChannels.map(
                (ch) => ch.groupUUID === +groupUUID
              );
              console.log(`groupsChannels:${groupsChannels}`);
            });
          }
        });
      }
    });
  },
  getChannelDetails: (req, res) => {
    const { userID, groupUUID, channelUUID } = req.body;
    console.log(userID);
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +userID);
      if (j === -1) {
        console.log("error user does not exist");
      }
      console.log(allUsers[j]);
      if (allUsers[j].roles.includes("SUPERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let currentGroup = allGroups.findIndex((g) => g.UUID === +groupUUID);
          if (allGroups[currentGroup]?.channels.length < 1) {
            res.send({ error: "No Channels in Group" });
          } else {
            fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
              let allChannels = JSON.parse(data);
              let i = allChannels.findIndex((ch) => ch.UUID === +channelUUID);
              let thisChannel = allChannels[i];
              console.log(thisChannel);
              let returnObj = { name: thisChannel.name };
              res.send(JSON.stringify(returnObj));
            });
          }
        });
      }
    });
  },

  createNewChannel: (req, res) => {
    const { userID, name, group } = req.body;
    console.log(userID);
    fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +userID);
      if (j === -1) {
        console.log("error");
      }
      console.log(allUsers[j]);
      if (allUsers[j].roles.includes("SUPERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let currentGroup = allGroups.findIndex((g) => g.UUID === +group);
          fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
            let allChannels = JSON.parse(data);
            let newChannelUUID = allChannels.length + 1;
            let newChannel = new Channel(name, newChannelUUID, group, userID);
            allChannels.push(newChannel);
            fs.writeFile(
              DATABASE.CHANNELS_DB,
              JSON.stringify(allChannels),
              "utf-8",
              (error) => console.log(error)
            );
            allGroups[currentGroup].channels.push(newChannelUUID);
            fs.writeFile(
              DATABASE.GROUPS_DB,
              JSON.stringify(allGroups),
              "utf-8",
              (error) => console.log(error)
            );
            return res.send(
              JSON.stringify({
                ok: true,
                message: `Channel: ${name} was added to Group: ${group}`,
              })
            );
          });
        });
      } else if (allUsers[j].roles.includes("USERADMIN" && !"SUPERADMIN")) {
        fs.readFile(DATABASE.GROUPS_DB, "utf8", (error, data) => {
          let allGroups = JSON.parse(data);
          let currentGroup = allGroups.findIndex((g) => g.UUID === +group);
          if (!allGroups[currentGroup].admins.includes(userID)) {
            res.send({ error: "Not Authenticated" });
          } else {
            fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
              let allChannels = JSON.parse(data);
              let newChannelUUID = allChannels.length + 1;
              let newChannel = new Channel(name, newChannelUUID, group, userID);
              allChannels.push(newChannel);
              fs.writeFile(
                DATABASE.CHANNELS_DB,
                JSON.stringify(allChannels),
                "utf-8",
                (error) => console.log(error)
              );
              allGroups[currentGroup].channels.push(newChannelUUID);
              fs.writeFile(
                DATABASE.GROUPS_DB,
                JSON.stringify(allGroups),
                "utf-8",
                (error) => console.log(error)
              );
              return res.send(
                JSON.stringify({
                  ok: true,
                  message: `Channel: ${name} was added to Group: ${group}`,
                })
              );
            });
          }

          return res.send(
            JSON.stringify({ ok: true, message: "Channel added" })
          );
        });
      } else res.send({ error: "Not Authenticated" });
    });
  },
  deleteChannelByID: (req, res) => {
    const { adminID, groupID, channelID } = req.body;
    return fs.readFile(DATABASE.USERS_DB, "utf8", (error, data) => {
      let allUsers = JSON.parse(data);
      let j = allUsers.findIndex((user) => user.UUID === +adminID);
      if (j === -1) {
        console.log("no user found");
        return res.send(
          JSON.stringify({ error: "No account for Admin found" })
        );
      }
      if (!allUsers[j].roles.includes("SUPERADMIN" || "USERADMIN")) {
        return res.send(
          JSON.stringify({ error: "Not Authorized to perform this action" })
        );
      }
      fs.readFile(DATABASE.GROUPS_DB, "utf-8", (error, data) => {
        let allGroups = JSON.parse(data);
        let g = allGroups.findIndex((group) => group.UUID === +groupID);
        if (
          allUsers[j].roles.includes("SUPERADMIN") ||
          allGroups[g].admins.includes(adminID)
        ) {
          let newChannels = allGroups[g].channels.filter(
            (channel) => channel !== +channelID
          );
          allGroups[g].channels = newChannels;
          console.log("new Channels");

          fs.writeFile(
            DATABASE.GROUPS_DB,
            JSON.stringify(allGroups),
            "utf-8",
            (error) => console.log(error)
          );
          fs.readFile(DATABASE.CHANNELS_DB, "utf-8", (error, data) => {
            let allChannels = JSON.parse(data);
            let c = allChannels.findIndex((ch) => ch.UUID === +channelID);
            if (c === -1) {
              return res.send(
                JSON.stringify({
                  error: "Channel can't be located on Database",
                })
              );
            }
            allChannels.splice(c, 1);
            fs.writeFile(
              DATABASE.CHANNELS_DB,
              JSON.stringify(allChannels),
              "utf-8",
              (error) => console.log(error)
            );
            return res.send(
              JSON.stringify({
                ok: true,
                message: `Channel: ${channelID} successfully removed from Group: ${groupID}`,
              })
            );
          });
        } else return res.send({ error: "User does not have permission" });
      });
    });
  },
};
