class Group {
  name;
  UUID;
  channels = [];
  users = [];
  admins = [];
  requests = [{ name: "TestUser", UUID: 69 }];
  banList = [];
  constructor(name, UUID) {
    this.name = name;
    this.UUID = UUID;
  }
}
module.exports = Group;
