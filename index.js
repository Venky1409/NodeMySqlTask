const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const async = require('async');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbstudents"
});

con.connect(function (err) {
    if (err) {
        console.log("Could connect to server"); 
    } else {
        console.log("Connected!");
    }
});

app.get('/',function(req,res) {
  res.json({"error" : false, "message" : "Technical Assessment!"});
});

//As a teacher, I want to register one or more students to a specified teacher.
app.post('/api/register', function (req, res) {
    const data = req.body;
    const teacherName = data.teacher;
    const students = data.students;

    async.waterfall([
        function (callback) {
            con.query("SELECT ID FROM teachers WHERE TeacherName='" + teacherName + "'", function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    const teacher = result[0];
                    const teacherId = teacher && teacher.ID || undefined;

                    if (!teacherId) {
                        con.query("INSERT INTO teachers (TeacherName) VALUES ('" + teacherName + "')", function (err, result) {
                            if (err) {
                                callback(err);
                            } else {
                                const teacherId = result && result.insertId;
                                callback(null, teacherId);
                            }
                        });
                    }
                }
            });
        },
        function (teacherId, callback) {
            async.eachLimit(students, 10, function (student, eachTime) {
                con.query("SELECT * FROM students WHERE StudentName='" + student + "' AND TeacherID=" + teacherId, function (err, result) {
                    if (err) {
                        eachTime(err);
                    } else {
                        const existsRecord = result[0];
                        const existsRecordId = existsRecord && existsRecord.ID || undefined;

                        if (!existsRecordId) {
                            con.query("INSERT INTO students (StudentName, SuspendStatus, TeacherID) VALUES ('" + student + "', 'Active','" + teacherId + "')", function (err, result) {
                                if (err) {
                                    eachTime(err);
                                }
                            });
                        }
                    }
                });
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    ], function (err) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Server error', err);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Students Registered Successfully', 'utf-8');
        }
    });
});
//As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).
app.get('/api/commonstudents', function (req, res) {
    //1. SELECT * FROM students inner join teachers on students.TeacherID = teachers.ID;
    //2. SELECT * FROM students inner join teachers on students.TeacherID = teachers.ID
    // WHERE teachers.ID IN (15, 16);
    //3. SELECT ID FROM teachers WHERE TeacherName IN ('teacherone@gmail.com', 'teachertwo@gmail.com');
    const queryData = req.query && req.query.teacher;
    const isItAList = Array.isArray(queryData);
    if(!isItAList) {
        con.query("SELECT * FROM teachers WHERE TeacherName='" + queryData + "'", function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    const teacherId = result[0].ID;
                    con.query("SELECT * FROM students WHERE TeacherID='" + teacherId + "'", function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                let studentResult = {"students": []};
                                result.forEach(function(data){
                                    studentResult.students.push(data.StudentName)
                                })
                                res.send(studentResult);
                            }
                    });
                }
        });
    }
    if(isItAList) {
        const studentResult = {"students": []};
        async.eachLimit(queryData, 10, function (teacherName, eachTime) {
        con.query("SELECT * FROM teachers WHERE TeacherName='" + teacherName + "'", function (err, result) {
            if (err) {
                console.log(err);
            } else {
                let teacherId = result[0].ID;
                con.query("SELECT * FROM students WHERE TeacherID='" + teacherId + "'", function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        result.forEach(function(data) {
                            studentResult.students.push(data.StudentName);
                            });
                        console.log(studentResult);
                        }
                    });
                }
        });
    }, function(err) {
        if (err) {
            res.end({"message": err});
        } else {
            res.send(studentResult);
        }
    });
    }
});
//As a teacher, I want to suspend a specified student.
app.post('/api/suspend', function (req, res) {
    const data = req.body;
    const studentName = data.student;
    con.query("DELETE FROM students WHERE StudentName='" + studentName + "'", function (err, result) {
                if (err) {
                    res.send({"message": err});
                } else {
                    if(result.affectedRows) {
                        res.end("Successfully deleted student");
                    } else {
                        res.end("No studend found in the table");
                    }
                }
        });
});
//As a teacher, I want to retrieve a list of students who can receive a given notification.
app.post('/api/retrievefornotifications', function (req, res) {
    const data = req.body;
    const teacherName = data.teacher;
    const notifications = data.notification;
    const regex = /\S+[a-z0-9]@[a-z0-9\.]+/img;
    const emails = data.notification.match(regex);
    const studentResult = {"students": []};
    if(emails) {
        emails.forEach(function(data, index) {
            emails[index] = data.substr(1);
            studentResult.students.push(emails[index]);
        });
    }
    con.query("SELECT * FROM teachers WHERE TeacherName='" + teacherName + "'", function (err, result) {
            if (err) {
                res.end('Server error or Teacher not found', err);
            } else {
                let teacherId = result[0].ID;
                con.query("SELECT * FROM students WHERE TeacherID='" + teacherId + "'", function (err, result) {
                    if (err) {
                        res.send({"message": err});
                    } else {
                        result.forEach(function(data) {
                            studentResult.students.push(data.StudentName)
                            });
                        res.send(studentResult);
                        }
                    });
                }
        });
});

app.listen(1400);

console.log("Running at Port 1400");