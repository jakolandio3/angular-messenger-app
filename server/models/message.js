class Message {
  UUID;
  channelUUID;
  groupUUID;
  creatorUUID;
  content;
  constructor(UUID, channelUUID, groupUUID, creatorUUID, content) {
    this.UUID = UUID;
    this.channelUUID = channelUUID;
    this.groupUUID = groupUUID;
    this.creatorUUID = creatorUUID;
    this.content = content;
  }
}
module.exports = Message;
