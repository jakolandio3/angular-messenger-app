class Channel {
  name;
  UUID;
  groupUUID;
  createdBy;
  messages = [];
  constructor(name, UUID, groupUUID, createdBy) {
    this.name = name;
    this.UUID = UUID;
    this.groupUUID = groupUUID;
    this.createdBy = createdBy;
  }
}
module.exports = Channel;
