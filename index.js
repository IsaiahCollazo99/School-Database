const playAudio = () => {
    let audio = document.querySelector("audio");
    audio.play();
    document.removeEventListener("click", playAudio)
} // End of playAduio() function

document.addEventListener("click", playAudio) // End of audio.play() click listener

document.addEventListener("DOMContentLoaded", () => {
    let classForm = document.querySelector("#classForm");
    let studentForm = document.querySelector("#studentForm");
    let enrollForm = document.querySelector("#enrollForm");
    let updateForm = document.querySelector("#updateForm");
    let findStudentForm = document.querySelector("#findStudentForm");
    let listForm = document.querySelector("#listForm");

    classForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addClass();
    });
    
    studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addStudent();
    });

    enrollForm.addEventListener("submit", (e) => {
        e.preventDefault();
        enrollStudent();
    })

    updateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        updateStudent();
    })

    findStudentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        findStudent();
    })

    listForm.addEventListener("submit", (e) => {
        e.preventDefault();
        listStudents();
    });
}) // End of DOMContentLoaded

const postData = async (url, data, callback) => {
    try {
        let res = await axios.post(url, data);
        callback(res.data);
    } catch (err) {
        console.log(err);
    }
} // End of postData() function

const addClass = async () => {
    let className = document.querySelector("#className");
    let classTeacher = document.querySelector("#classTeacher");
    let classSection = document.querySelector("#classResponse");
    // Grab the needed class tags

    // Check if either of the inputs are empty
    if(!className.value || !classTeacher.value) { 
        // If true then add an error display
        classSection.innerHTML = "";
        let p = document.createElement("p");
        p.innerText = "Please fill out all information.";
        classSection.appendChild(p);
    } else {
        // If all data was entered then post it to the DB
        let newClass = {name: className.value, teacher: classTeacher.value};
        postData("http://localhost:3000/class", newClass, appendClassResponse);
    }
    
} // End of addClass() function

const appendClassResponse = (data) => {
    let classSection = document.querySelector("#classResponse");
    classSection.innerHTML = "";
    // Reset the classSection section

    let newClass = data.class;

    // Check if there is an error
    if(data.error) {
        // Display an error if so
        let err = document.createElement("p");
        err.innerText = "Class already exists.";
        classSection.appendChild(err);
    } else {
        // Display the information of the class added if no error
        let status = document.createElement("p");
        status.innerText = "Class Added";
        let p = document.createElement("p");
        p.innerHTML = `<b>Class Name</b>: ${newClass.name} <b>Teacher</b>: ${newClass.teacher}`;
        classSection.appendChild(status);
        classSection.appendChild(p);

        // Reset the input tags
        document.querySelector("#className").value = "";
        document.querySelector("#classTeacher").value = "";
    }
} // End of appendClassResponse() function

const addStudent = () => {
    let studentFirst = document.querySelector("#studentFirst");
    let studentLast = document.querySelector("#studentLast");
    let studentCity = document.querySelector("#studentCity");
    let studentAge = document.querySelector("#studentAge");
    let studentSection = document.querySelector("#studentResponse");
    // Grab all needed student tags

    // Check if any info was empty
    if(!studentFirst.value || !studentLast.value || !studentCity.value || !studentAge.value) {
        // If any inputs are empty then display an error
        studentSection.innerHTML = "";
        let p = document.createElement("p");
        p.innerText = "Please fill out all information.";
        studentSection.appendChild(p);
    } else {
        // Post the data if all data is entered
        let student = {
            firstName: studentFirst.value,
            lastName: studentLast.value,
            city: studentCity.value,
            age: studentAge.value
        }
        
        postData(`http://localhost:3000/student/`, student, appendStdResponse);
    }
} // End of addStudent() function

const appendStdResponse = (data) => {
    let studentSection = document.querySelector("#studentResponse");
    studentSection.innerHTML = "";
    // Reset the studentSection

    let student = data.student;

    let message = document.createElement("p");
    message.innerText = "Added student";

    let studentInfo = document.createElement("p");
    studentInfo.innerHTML = `<b>Name</b>: ${student.first_name} ${student.last_name} <b>City</b>: ${student.city} <b>Age</b>: ${student.age}`;

    studentSection.appendChild(message);
    studentSection.appendChild(studentInfo);

    document.querySelector("#studentFirst").value = "";
    document.querySelector("#studentLast").value = "";
    document.querySelector("#studentCity").value = "";
    document.querySelector("#studentAge").value = "";

} // End of appendStdResponse() function

const enrollStudent = async () => {
    let enrollClass = document.querySelector("#enrollClass");
    let enrollStudent = document.querySelector("#enrollStudent");
    let enrollGrade = document.querySelector("#enrollGrade");
    let enrollResponse = document.querySelector("#enrollResponse");

    enrollClass = enrollClass.value;
    let student = enrollStudent.value;
    let grade = enrollGrade.value

    if(!enrollClass || !student || !grade) {
        enrollResponse.innerHTML = "";
        let error = document.createElement("p");
        error.innerText = "Please fill out all information";
        enrollResponse.appendChild(error);
    } else {
        try {
            let res = await axios.post(`http://localhost:3000/class/${enrollClass}/${student}/enroll/${grade}`);
            appendEnrollResponse(res.data);
        } catch(err) {
            console.log(err);
        }
    }
} // End of enrollStudent() function

const appendEnrollResponse = (data) => {
    let enrollSection = document.querySelector("#enrollResponse");
    enrollSection.innerHTML = "";
    
    if(data.error) {
            let error = document.createElement("p");
            error.innerText = data.error;
            enrollSection.appendChild(error);
    } else if(data.message === "Enrolled Student") {
        let {student, className, grade} = data;

        let message = document.createElement("p");
        message.innerHTML = data.message + ` in class <b>${className}</b>`;
        
        let studentInfo = document.createElement("p");
        studentInfo.innerHTML = `<b>Name</b>: ${student.first_name} ${student.last_name} <b>Grade</b>: ${grade}`;

        enrollSection.appendChild(message);
        enrollSection.appendChild(studentInfo);

    } else if(data.message === "Updated Student") {
        let {student, className, grade} = data;

        let message = document.createElement("p");
        message.innerHTML = data.message + ` in class <b>${className}</b>`;
        
        let studentInfo = document.createElement("p");
        studentInfo.innerHTML = `<b>Name</b>: ${student.first_name} ${student.last_name} <b>Grade</b>: ${grade}`;

        enrollSection.appendChild(message);
        enrollSection.appendChild(studentInfo);
    }
    
}

const updateStudent = async () => {
    let updateId = document.querySelector("#updateId");
    let updateFirst = document.querySelector("#updateFirst");
    let updateLast = document.querySelector("#updateLast");
    let updateAge = document.querySelector("#updateAge");
    let updateCity = document.querySelector("#updateCity");
    let updateResponse = document.querySelector("#updateResponse");
    // Grab all needed update tags

    let id = updateId.value;
    let firstName = updateFirst.value;
    let lastName = updateLast.value;
    let age = updateAge.value;
    let city = updateCity.value;
    // Set variables for the values for readability

    if(!id) {
        let error = document.createElement("p");
        error.innerText = "Please enter a student ID (If not known, use find student)";
        updateResponse.appendChild(error);
    } else {
        let updates = [];
        if(firstName) updates.push(await axios.patch(`http://localhost:3000/student/${id}?firstName=${firstName}`));
        if(lastName) updates.push(await axios.patch(`http://localhost:3000/student/${id}?lastName=${lastName}`));
        if(age) updates.push(await axios.patch(`http://localhost:3000/student/${id}?age=${age}`));
        if(city) updates.push(await axios.patch(`http://localhost:3000/student/${id}?city=${city}`));
        
        appendUpdateResponse(updates);
    }
} // End of updateStudent() function

const appendUpdateResponse = (updateData) => {
    let updateResponse = document.querySelector("#updateResponse");
    let updates = updateData;

    if(updates[0].data.updated.name) {
        let updateUl = document.createElement("ul");
        updates.forEach((update, i) => {
            if(update === updates[updates.length - 1]) {
                let student = update.data.updated;
                let {id, first_name, last_name, city, age} = student;
                let updatedStudent = document.createElement("p");
                updatedStudent.innerHTML = `<b>Student ID</b>: ${id} <b>First Name</b>: ${first_name} <b>Last Name</b>: ${last_name} <b>City</b>: ${city} <b>Age</b>: ${age}`;
                updateResponse.appendChild(updatedStudent);
            }
            let li = document.createElement("li");
            li.innerText = update.data.message;
            updateUl.appendChild(li);
        })

        updateResponse.appendChild(updateUl);
    } else {
        let error = document.createElement("p");
        error.innerText = "No student found by that ID";
        updateResponse.appendChild(error);
    }
} // End of appendUpdateStudent() function

const findStudent = async () => {
    let findStudentId = document.querySelector("#findStudentId");
    let findStudentFirst = document.querySelector("#findStudentFirst");
    let findStudentLast = document.querySelector("#findStudentLast");
    let findStudentResponse = document.querySelector("#findStudentResponse");

    let id = findStudentId.value;
    let firstName = findStudentFirst.value;
    let lastName = findStudentLast.value;

    if(!id && (!firstName && !lastName)) {
        findStudentResponse.innerHTML = "";
        let p = document.createElement("p");
        p.innerText = "Please enter either a students id OR both first and last names.";
        findStudentResponse.appendChild(p);
    } else {
        let res;

        if(id) {
            res = await axios.get(`http://localhost:3000/student/${id}`);
        } else if(firstName && lastName) {
            res = await axios.get(`http://localhost:3000/student/${firstName}/${lastName}`);
        }
        
        appendFindStdResponse(res.data);
    }

} // End of findStudent() function

const appendFindStdResponse = (data) => {
    let findStudentResponse = document.querySelector("#findStudentResponse");
    findStudentResponse.innerHTML = "";
    
    if(data.students) {
        let students = data.students;
        let message = document.createElement("p");
        message.innerText = data.message;

        let studentUl = document.createElement("ul");
        students.forEach(student => {
            let li = document.createElement("li");
            li.innerHTML = `<b>Student ID</b>: ${student.id} <b>Name</b>: ${student.first_name} ${student.last_name} <b>Age</b>: ${student.age} <b>City</b>: ${student.city}`;
            studentUl.appendChild(li);
        })

        findStudentResponse.appendChild(message);
        findStudentResponse.appendChild(studentUl);
    } else if(!data.student.length) {
        let error = document.createElement("p");
        error.innerText = "No student found"
        findStudentResponse.appendChild(error);
    } else {
        let student = data.student[0];
        let classes = data.classes;

        let studentInfo = document.createElement("p");
        studentInfo.innerHTML = `<b>Student ID</b>: ${student.id} <b>Name</b>: ${student.first_name} ${student.last_name} <b>Age</b>: ${student.age} <b>City</b>: ${student.city}`

        let classesHeading = document.createElement("h3");
        classesHeading.innerText = "Classes:" 

        let classesUl = document.createElement("ul");
        classes.forEach(foundClass => {
            let li = document.createElement("li");
            li.innerHTML = `<b>Class Name</b>: ${foundClass.class_name} <b>Teacher</b>: ${foundClass.teacher} <b>Grade</b>: ${foundClass.grade}`
            classesUl.appendChild(li);
        })

        findStudentResponse.appendChild(studentInfo);
        findStudentResponse.appendChild(classesHeading);
        findStudentResponse.appendChild(classesUl);
    }
} // End of appendFindStdResponse() function

const listStudents = async () => {
    let listClass = document.querySelector("#listClass");
    let listCity = document.querySelector("#listCity");
    let listFailing = document.querySelector("#listFailing");
    let listResponse = document.querySelector("#listResponse");
    // Grab all needed list tags

    // Check if no class was entered
    if(!listClass.value) {
        // Display an enter class error if so
        listResponse.innerHTML = "";
        let p = document.createElement("p");
        p.innerText = "Please enter a class.";
        listResponse.appendChild(p);
    } else {
        let res;
    
        // Depending on the if the user wants failing students, students from a city or both get diff data
        if(listFailing.checked && listCity.value) {
            res = await axios.get(`http://localhost:3000/class/${listClass.value}/students?failing=true&city=${listCity.value}`);
        } else if(listFailing.checked) {
            res = await axios.get(`http://localhost:3000/class/${listClass.value}/students?failing=true`);
        } else if(listCity.value) {
            res = await axios.get(`http://localhost:3000/class/${listClass.value}/students?city=${listCity.value}`);
        } else {
            res = await axios.get(`http://localhost:3000/class/${listClass.value}/students`);
        }

        // Reset input tags
        listClass.value = "";
        listCity.value = "";
        listFailing.checked = false;

        // Post list data
        appendListResponse(res.data);
    }
} // End of listStudents() function

const appendListResponse = (data) => {
    let listResponse = document.querySelector("#listResponse");
    listResponse.innerHTML = "";
    let students = data.students;
    // Reset listResponse section and grab data.student

    // Check if any students are returned
    if(!students) {
        // If not then display "No students found"
        let noStudents = document.createElement("p");
        noStudents.innerText = "No students found.";
        listResponse.appendChild(noStudents);
    } else {
        // If yes then display each student
        let studentList = document.createElement("ul");
        let classHeading = document.createElement("h3");
        classHeading.innerText = data.className;

        students.forEach(student => {
            let li = document.createElement("li");
            li.innerHTML = `<b>Student ID</b>: ${student.id} <b>Name</b>: ${student.first_name} ${student.last_name} <b>Age</b>: ${student.age} <b>City</b>: ${student.city} <b>Grade</b>: ${student.grade}`;
            studentList.appendChild(li);
        })
        listResponse.appendChild(classHeading);
        listResponse.appendChild(studentList);
    }
} // End of appendListResponse() function