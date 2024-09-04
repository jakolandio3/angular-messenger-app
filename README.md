# AngularMessenger

## Details

### Created by

Name: Jakob Douglas

Student ID: S54069

Course: 3813ICT

Year: 2024

### Description

A Full-Stack Application using the MEAN Stack (MongoDB, ExpressJS, Angular and NodeJS), This application will provide a text/video instant messaging system leveraging the power of modules such as socket.io and peer.js.

This application allows for users to create a profile update and save said profile join, groups and channels within that group to start communicating.

### Additional notes

The Application Incorporates user Authentication and Authorization meaning that there are roles implemented into the users.

There are three main roles. A Super Admin, a Group Admin and a Chat User. There is also the public roles of a user who is not authenticated/ registered yet.

A regular user must first register and request to be added to a group before participating in said group and its channels. The group user may also remove themselves from any group,login/logout or delete their account entirely.

Group Admins additionally will control and have rights for updating/deleting groups/channels they are an admin to including banning and reporting users along with adding new users to the group.

The Super User additionally will have Group Admin rights to all groups and the ability to change a users roles/permissions.

### Video Demonstrations

Links: TBA

## Git Repository

### [GitHub Link](https://github.com/jakolandio3/angular-messenger-app)

### GIT Commands used

- **git init** _(Initialise local repository)_
- **git add 'file'** _(Add file/s to be tracked)_
- **git commit** _(commit the local changes with a message -m "message")_
- **git remote add origin [url
  to your repo]** _(Add an alias for origin to remote repo (in this case on GitHub))_
- **git push origin [branch]** _(push the changes to remote origin on branch specified)_
- **git checkout -b [branch name]** _(Create a new local branch name and switching to that branch)_
- **git merge [branch name]** _(Merge another branch with your currently opened branch)_

### Git Structure

#### **Branches/pushes**

- **Main**
  - Push Initial Commit
  - Push Docs: Scaffold readme file
  - Merge feat/front-end-routes
  - Merge feat/login-logout
  - Merge feat/authenticated-routes
- **feat/front-end-routes**
  - Push Feat: Scaffold routes in front-end
- **feat/login-logout**
  - Push Feat: Login function
  - Push Feat: Logout/Create user function
  - Push Feat: Delete User function
- **feat/authenticated-routes**
  - Push Feat: Authenticated-Route
- **feat/groups**
  - Push Feat: getGroups

### Git Repository Pushes/Updates

_A comprehensive breakdown of each commit to the remote repository along with message and branch._

#### Initial Commit -Main

1. Set up file structure
2. Set up Server folder in main repository
3. Install most packages needed on front end (socket.io-client, bootstrap)
4. Install most packages needed on back end (socket.io, express, nodemon, cors)
5. Scaffold express structure in back end (create models folder and assumed models, set up routes folder and assumed routes)
6. Add bootstrap to the angular.json file
7. Set up routing for the front end
8. Add provideHttpClient to to providers array in angular

#### Docs: Scaffold readme file -Main

1. Major changes to readme.md

#### Feat: Scaffold routes in front-end -feat/front-end-routes

1. Changes to readme.md
2. Added components Account, Admin, Channel, Groups, Login, Profile and Register
3. Added new components to router
4. Basic scaffold of new components
5. basic scaffold of new components html

#### Feat: Login function -feat/login-logout

1. Changes to readme.md
2. Login function created on backend
3. login function created on login component
4. new service created CheckAuth
5. CheckAuth functions added

#### Feat: Logout/Create user function -feat/login-logout

1. Changes to readme.md
2. Logout function created on backend
3. Update function created on backend
4. CreateUser function created on backend
5. CheckAuth functions added
6. Register Component UI Updated
7. Routing added to Register Component
8. Update functions added to Account Component

#### Feat: Delete User function -feat/login-logout

1. Changes to readme.md
2. Delete function created on back-end
3. Delete function created in CheckAuth Service
4. Delete function created in Account Component

#### Feat: Authenticated-Routes -feat/authenticated-routes

1. Changes to readme.md
2. Added View differences depending on user permissions
3. added function to check authentication level to CheckAuth
   service

#### Feat: getGroups -feat/groups

1. Changes to readme.md
2. Added new service for group related functions
3. Added functions for retrieving groups in Groups Component
4. Added function on back-end for retrieving groups

## Data Structures

_Defines how various entities are represented in different areas of the application._

### Front end

_A description of data structures used to represent various entities in the front-end of the application e.g interfaces or classes._

1. **Users**
   - **Interface:** _userObj {
     username?: string;
     email?: string;
     valid?: boolean;
     UUID?: number;
     password?: string;
     roles: role[];
     groups: group[];
     }_
2. **Groups**
   - **interface** _group {
     groupID: Number;
     isAdmin: boolean;
     }_
3. **Roles**
   - **type** _role = 'SUPERADMIN' | 'GROUPADMIN' | 'USER'_
4. **Channels** - N/A yet
5. **Message** - N/A yet

### Back end

_A description of the models used in the back-end of the application._

1. **User**- Model in server/models file
   - **Class** _user ={
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
     }_
2. **Group** - Model in server/models file
3. **Channel** - Model in server/models file
4. **Message** - Model in server/models file

### Database

_A description of the structure of each database._

1. **Users** - an array of type user stringified to the json file in database folder
2. **Groups** -an array of type group stringified to the json file in database folder N/A and EMPTY currently
3. **Channels** - an array of type channel stringified to the json file in database folder N/A and EMPTY currently

## Angular Architecture

_The set-up and Structure of the front-end of the application._

### Components

_The Angular components available and in use on this application._

1. **App**

   - Provides Nav bar using RouterLink and Displays current Route using Router-Outlet
   - Handles Logout Function and displays certain links when authorized or not

2. **Account**

   - Provides authenticated users with details of their account available to update
   - Functions for updating basic account variables
   - Handles unauthorized users by routing back to /login
   - Allows users to Delete account by calling AuthService Delete Function

3. **Admin**

   - Provides authenticated and administrative users services to add, change, update or delete groups, users and channels view is different depending on roles

4. **Channel**

   - Provides authenticated users to access a particular channel and display, send and receive messages
   - Nothing else implemented Yet

5. **Groups**

   - Provides authenticated users with a view of groups dependent on your authorization level/role and if you are in said group

6. **Login**

   - Provides users with a way to authenticate and login
   - Provides a username and password form for users to login
   - Contains function for login using CheckAuth service functions to return an observable and subscribing to the output

7. **Profile**

   - Provides authenticated users with a view of their details
   - Details are rendered from logged in user
   - Nothing else implemented Yet

8. **Register**

   - Provides users to register and become authenticated
   - Submits function to back end and routes user to home page on success

### Services

_The Angular services available and in use on this application._

1. **"CheckAuth"**
   - **Description:** A Angular Service for authentication and handler functions such as storing and fetching data in session storage and making calls to the server.
   - **Available Functions:**
     1. Login: Call back-end to validate user
     2. Logout: Call back-end to un-validate user and clear session storage
     3. UpdateUser: Call back end to make changes to a users details
     4. CheckIsValid: Checks session storage to see if user is logged in
     5. SaveToSessionStorage: Save a key value pair to session storage
     6. ClearSessionStorage: Clears SessionStorage
     7. GetFromSessionStorage: Gets Value From SessionStorage
     8. CreateUser: Makes a call to the server to create a new user
     9. RemoveAccount: Makes a call to the server to Delete the registered users account
     10. CheckPermissions: Checks on the permissions of the current User
     11. getValid: a BehaviorSubject a component can subscribe to to get isValid on user
     12. getPermissions: a BehaviorSubject a component can subscribe to to get the array of permissions/roles on user
   - **Used In:**
     1. Login Component
     2. App Component
     3. Profile Component
     4. Groups Component
     5. Account Component
     6. Channel Component
     7. Admin Component
     8. Register Component

### Routes (Angular)

_The available routes/endpoints we can hit on our front-end Angular project._

1. **"/" (App Route)**

   - Displays App Component
   - Will provide Navigation
   - Will most likely re-direct later to home or login

2. **"/login"**

   - Displays Login Component
   - Will provide Navigation
   - Will most likely re-direct later to home if user is authenticated already

3. **"/register"**

   - Displays Register Component
   - Creates a new user if username does not exist
   - Routes user to /auth/home when registered and validated

4. **"/auth"**

   - redirects to /auth/home if authenticated and to /login if not

5. **"/auth/home" (App Route)**

   - Displays Groups Component
   - Will re-direct if unauthorized to /login

6. **"/auth/profile" (App Route)**

   - Displays Profile Component
   - Will re-direct if unauthorized to /login

7. **"/auth/room" (App Route)**

   - Will re-direct if authorized to /auth/home or if unauthorized will redirect to /login

8. **"/auth/room/:id" (App Route)**

   - Displays Channel Component
   - Will re-direct if unauthorized to /login

9. **"/auth/account" (App Route)**

   - Displays Account Component
   - Will redirect if unauthorized
   - Allows users to update username, email and password

10. **"/auth/admin" (App Route)**

    - Displays Admin Component
    - Will redirect if unauthorized to /login, if authorized but not an admin it will redirect to /auth/home

## Server (Express) Architecture

_The set up and structure of the back-end of the application._

### Modules (back-end)

_A list of the module files that contain functions imported and used on the server._

1. **Models** - contains model architecture as classes for creating new channels, users, groups and messages

2. **Routes** - contains routes for different end-points

3. **Routes/api/auth** - contains functions for user authentication and mutations including creation and deletion of users

4. **Routes/api/group** - contains functions for group authentication and mutations including creation and deletion of groups and channels

### Functions

_A list of files on the back-end and a sub-list of the functions they contain._

1. **Server.js**

   1. **express()** - Creates a new express app (_'const app=expess()'_)
   2. **app.use(cors())** - uses cors middleware for cross origin resource sharing.
   3. **app.use(express.json())** -provides an ease of use function to stringify and parse data.
   4. **app.use(express.urlencoded({ extended: true }))** - makes express app only look at header section when teh content type is matched.
   5. **app.get('some route',some function)** - when a route as a get request satisfies the 'some route' condition the some function is ran.

2. **Listen.js**

   1. **Listen(app,PORT)** - A helper function for the server it takes in an app and a port and runs the server on that port.

3. **Auth.js**

   1. **Login** - A function that looks at the request object(email and password) and compares it to the user database sending back a user object if the user exists and credentials are correct, if incorrect or user does not exist it sends back a valid:false.
   2. **Logout** - A function that checks passed in UUID and un-validates user.
   3. **Update** - A Function that looks at the request object, checks for a valid match in the database and updated fields accordingly.
   4. **CreateUser** - A function that looks at the request object and checks to see if the username has been registered on the database, if it has not the function creates a new User class instance (UUID is assured to be new each time) and pushes it to the database, returning the object in the response.
   5. **Delete** - A function that checks passed in UUID and deletes the user from the database.

4. **Group.js**
   1. **getAll** - A function that looks at the users UUID goes through the groups DB and returns all groups the user has been assigned to
   2. **getAllID** - A function that grabs all groups and returns just the name and UUID of all groups

### Routes (Express)

_Routes that are available on the back-end and an explanation of what they do._

1. **"/"**

   - **GET:**

     - **Function:** basic lambda arrow function
     - **Params:** None
     - **Return:** "hello"
     - **Purpose:** Respond the a successful connection to the server

   - **POST:** N/A

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

2. **"/auth/login"**

   - **GET:** N/A

   - **POST:**

     - **Function:** Login()
     - **Params:** {email: string;
       pwd: string;}
     - **Return:** stringified userObj
     - **Purpose:**Authenticate a user

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

3. **"/auth/logout"**

   - **GET:** N/A

   - **POST:**

     - **Function:** Logout()
     - **Params:** {UUID: string;}
     - **Return:** VOID
     - **Purpose:** in-validate user on database

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

4. **"/auth/update"**

   - **GET:** N/A

   - **POST:**

     - **Function:** Update()
     - **Params:** {user:userObj}
     - **Return:** stringified userObj
     - **Purpose:**Update a users details

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

5. **"/auth/register"**

   - **GET:** N/A

   - **POST:**

     - **Function:** CreateUser()
     - **Params:** {email: string;
       pwd: string;}
     - **Return:** stringified userObj
     - **Purpose:** Create a new instance of Class user, add it to the database and Authenticate a user

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

6. **"/auth/delete"**

   - **GET:** N/A

   - **POST:**

     - **Function:** CreateUser()
     - **Params:** {UUID: string}
     - **Return:** VOID
     - **Purpose:** Runs a function for removing an account from the database

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

7. **"/group/all"**

   - **GET:** N/A

   - **POST:**

     - **Function:** GetAll()
     - **Params:** {UUID: string}
     - **Return:** Group[]
     - **Purpose:** Runs a function on the server to lookup associated groups for the user

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

8. **"/group/all"**

   - **GET:**

     - **Function:** GetAllID()
     - **Params:** NONE
     - **Return:** []{UUID,name}
     - **Purpose:** Runs a function on the server to lookup all groups and return some data about them

   - **POST:** N/A

   - **PUT:** N/A

   - **PATCH:** N/A

   - **DELETE:** N/A

### Files

_Files that are accessed/used by our back end._

1. **Database**
   1. channels.json -pseudo db for model Channel
   2. groups.json -pseudo db for model Group
   3. users.json -pseudo db for model User

### Global Variables

_Variables available to globally to the back-end._

1. **Config**
   1. CLIENT_URL - A URL for the client used for cors handling later
   2. CHANNELS_DB - A URL for the channels database
   3. GROUPS_DB - A URL for the groups database
   4. USERS_DB - A URL for the users database

## Node Architecture

_Node modules installed to our application._

### Modules (Installed Node Modules)

- **Front End (Angular)**

  - **npm i -g @angular/cli** _(Install Angular CLI Globally)_
  - **npm i bootstrap -save** _(Install and save bootstrap locally for the project)_
    **\*_note: Bootstrap requires you to update the "styles" array in the angular.json file and add bootstrap css file {"node_modules/bootstrap/dist/css/bootstrap.min.css",}_**
  - **npm i socket.io-client** _(Install socket.io for client side allowing bi-directional communication)_

- **Back End (Express)**
  - **npm i cors -save** _(Install cors for cross origin handling)_
  - **npm i express** _(Install express for our back end in server folder)_
  - **npm i nodemon -g** _(Install global nodemon for hot-reload on our server side)_
  - **npm i socket.io** _(Install socket.io for our server side allowing bi-directional communication)_

## Client Server Interaction

_Description of what happens on each side of our application during a certain event._

### Login User

- **Front-End:** Redirects to auth/home, and stores user data in the session storage.

- **Back-End:** Runs a Login function accesses database, checks user validation and returns a userObj

- **DataBase:** The user accessed on users DB is mutated to have valid:true

### Logout User

- **Front-End:** Redirects to /login, navbar icons and links are changed/updated accordingly, session storage is emptied

- **Back-End:** in-validates user in database

- **DataBase:** The user accessed on users DB is mutated to have valid:false

### Update User (in settings)

- **Front-End:** Session storage is updated accordingly instances of values taken from session storage are changed to reflect new data

- **Back-End:** Runs a function to access database and update user accordingly after validation checks

- **DataBase:** The user accessed on users DB is mutated accordingly

### Create New User (in settings)

- **Front-End:** Session storage is updated and user is redirected to auth/home

- **Back-End:** Runs a function to access database check if email is already in use and if not it creates a new user and pushed it to the database

- **DataBase:** A new user is added to the users DB

### Delete User

- **Front-End:** Session storage is wiped and user is redirected to the login screen

- **Back-End:** Runs a function for removing user at a passed UUID from the database

- **DataBase:** Is updated to no longer contain the user at the passed UUID

### Fetch Group Data

- **Front-End:** Group data is displayed on the home page of the auth routes, displaying groups youre associated in allowing connection as well as showing the other groups with a handler for requesting access.

- **Back-End:** Runs a 2 functions, 1 to grab all the groups with just the ID and name, and 2 to grab all the details of groups a user is associated with

- **DataBase:** Is updated to no longer contain the user at the passed UUID
