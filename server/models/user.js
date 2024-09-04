// some user models will go here initially as classes then as MONGODB models users will have a min of username, email,id, roles and groups
export class User {
  username;
  email;
  valid = true;
  UUID;
  password;
  roles = ["USER"];
  groups = [];
  constructor(username, email, password, UUID) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.UUID = UUID;
  }
}
