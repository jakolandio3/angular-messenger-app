class Message {
  UUID;
  channelUUID;
  groupUUID;
  creatorUUID;
  creatorName;
  content;
  constructor(UUID, channelUUID, groupUUID, creatorUUID, creatorName, content) {
    this.UUID = UUID;
    this.channelUUID = channelUUID;
    this.groupUUID = groupUUID;
    this.creatorUUID = creatorUUID;
    this.creatorName = creatorName;
    this.content = content;
  }
}
module.exports = Message;
