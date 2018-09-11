#Technical Assessment - Task

## Building and Running the Application

1. Install NPM (v3.10.10), Node (v6.10.3)
  * https://nodejs.org/en/download/
### Initial setup

Run `npm install` to install the web project's npm package dependencies

### Build/Start Node Server

Run `npm start` to build the project. This will Start the Node Server.

2. Install XAMPP server for MySQL database setup
  * https://www.apachefriends.org/download.html
3. Open XAMPP Control Panel and Start `Apache` and `MYSQL`
4. Open 
  * http://localhost/phpmyadmin/
5. Create Database `dbstudents`
  * Create TABLE `teachers`
    CREATE TABLE teachers (
      ID int NOT NULL AUTO_INCREMENT,
      TeacherName varchar(150) NOT NULL,
      PRIMARY KEY (ID)
    );
    * Create TABLE `students`
    CREATE TABLE students (
      ID int NOT NULL AUTO_INCREMENT,
      StudentName varchar(150) NOT NULL,
      SuspendStatus varchar(50) NOT NULL,
      TeacherID int NOT NULL,
      PRIMARY KEY (ID)
    );
6. Orelse import dbstudents.sql file to local database through http://localhost/phpmyadmin/
7. Open Postman for testing api's.

## To run unit test cases

1. Install Mocha (v3.10.10), Node (v6.10.3)
  Following libraries to be installed
  * npm install -g mocha
  * npm install --save-dev mocha
  * npm install --save-dev should
  * npm install --save-dev supertest

### Initial setup

2. Create a test folder and create test.js.
3. Write test cases.
4. Make sure Noder Serve is up and running.
5. run `mocha` to test your test cases.