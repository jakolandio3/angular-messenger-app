class Group {
  name;
  UUID;
  channels = [];
  users = [];
  constructor(name, UUID) {
    this.name = name;
    this.UUID = UUID;
  }
}
module.exports = Group;
