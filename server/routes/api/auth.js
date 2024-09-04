const DATABASE = require("../../config/index");
const fs = require("fs");

module.exports = {
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
};
