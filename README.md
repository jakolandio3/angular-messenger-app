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

### GitHub Link/s

https://github.com/jakolandio3/angular-messenger-app

### Git Structure

1. Branches
   1. Main
   2. TBA

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

## Data Structures

_Defines how various entities are represented in different areas of the application._

### Front end

_A description of data structures used to represent various entities in the front-end of the application e.g interfaces or classes._

1. **Users** - N/A yet
   1. **Super Admin**
      1. **Interface:** _Admin {name:String,id:Number,roles:Roles[],groups:Groups[]}_
      2. **Class:** _SUPER_ADMIN implements Admin{some function()}_
   2. **Group admin**
   3. **User(chat user)**
2. **Groups** - N/A yet
3. **Roles** -N/A yet
4. **Channels** - N/A yet
5. **Message** - N/A yet

### Back end

_A description of the models used in the back-end of the application._

1. **User** - Model in server/models file
2. **Group** - Model in server/models file
3. **Channel** - Model in server/models file
4. **Message** - Model in server/models file

### Database

_A description of the structure of each database._

1. **Users** - an array of type user stringified to the json file in database folder N/A and EMPTY currently
2. **Groups** -an array of type group stringified to the json file in database folder N/A and EMPTY currently
3. **Channels** - an array of type channel stringified to the json file in database folder N/A and EMPTY currently

## Angular Architecture

_The set-up and Structure of the front-end of the application._

### Components

_The Angular components available and in use on this application._

1. **App**

   1. Provides Nav bar using RouterLink and Displays current Route using Router-Outlet
   2. Nothing else implemented Yet

### Services

_The Angular services available and in use on this application._

1. **"none yet"**
   1. **Description:**
   2. **Available Functions:**
   3. **Used In:**

### Routes (Angular)

_The available routes/endpoints we can hit on our front-end Angular project._

1. **"/" (App Route)**

   1. Displays App Component
   2. Will provide Navigation
   3. Will most likely re-direct later to home or login

2. Thats it so far

## Server (Express) Architecture

_The set up and structure of the back-end of the application._

### Modules

_A list of the module files that contain functions imported and used on the server._

1. **Models** - contains model architecture as classes for creating new channels, users, groups and messages

2. **Routes** - contains routes for different end-points

### Functions

_A list of files on the back-end and a sub-list of the functions they contain._

1. **Server.js**

   1. **express()** - Creates a new express app (_'const app=expess()'_)
   2. **app.use(cors())** - uses cors middleware for cross origin resource sharing
   3. **app.use(express.json())** -provides an ease of use function to stringify and parse data
   4. **app.use(express.urlencoded({ extended: true }))** - makes express app only look at header section when teh content type is matched
   5. **app.get('some route',some function)** - when a route as a get request satisfies the 'some route' condition the some function is ran

2. **Listen.js**
   1. **Listen(app,PORT)** - A helper function for the server it takes in an app and a port and runs the server on that port

### Routes (Express)

_Routes that are available on the back-end and an explenation of what they do._

1. **"/"**

   **GET:**

   1. **Function:** basic lambda arrow function
   2. **Params:** None
   3. **Return:** "hello"
   4. **Purpose:** Respond the a successful connection to the server

   **POST:** N/A

   **PUT:** N/A

   **PATCH:** N/A

   **DELETE:** N/A

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

1. **Front End (Angular)**

   1. **npm i -g @angular/cli** _(Install Angular CLI Globally)_
   2. **npm i bootstrap -save** _(Install and save bootstrap locally for the project)_
      **\*_note: Bootstrap requires you to update the "styles" array in the angular.json file and add bootstrap css file {"node_modules/bootstrap/dist/css/bootstrap.min.css",}_**
   3. **npm i socket.io-client** _(Install socket.io for client side allowing bi-directional communication)_

2. **Back End (Express)**
   1. **npm i cors -save** _(Install cors for cross origin handling)_
   2. **npm i express** _(Install express for our back end in server folder)_
   3. **npm i nodemon -g** _(Install global nodemon for hot-reload on our server side)_
   4. **npm i socket.io** _(Install socket.io for our server side allowing bi-directional communication)_

## Client Server Interaction

_Description of what happens on each side of our application during a certain event._

### Login User

1. **Front-End:** does this

2. **Back-End:** does this

3. **DataBase:** does this

### Logout User

1. **Front-End:** does this

2. **Back-End:** does this

3. **DataBase:** does this

### Update User

1. **Front-End:** does this

2. **Back-End:** does this

3. **DataBase:** does this

### Delete User

1. **Front-End:** does this

2. **Back-End:** does this

3. **DataBase:** does this
