window.onload = function() {
    // Display students when the page loads
    displayStudents();

    // Save student data when the save button is clicked
    document.getElementById("save").onclick = saveStudent;

    // Function to handle deletion when delete button is clicked
    window.deleteRow = function(button) {
        var idNumber = button.getAttribute("data-id");
        var row = button.closest("tr");
        deleteStudent(idNumber, row);
    };

    // Function to handle updating when update button is clicked
    window.updateRow = function(button) {
        var row = button.closest("tr");
        updateStudent(row);
    };

    //Function to handle edit before update button is clicked
    window.editRow = function(button) {
        var idNumber = button.getAttribute("data-id");
        var row = button.closest("tr");
        var cells = row.getElementsByTagName('td');
        document.getElementById("idnumber").value = cells[0].textContent;
        document.getElementById("lastname").value = cells[1].textContent;
        document.getElementById("firstname").value = cells[2].textContent;
        document.getElementById("middlename").value = cells[3].textContent;
        document.getElementById("contactnumber").value = cells[4].textContent;
        document.getElementById("email").value = cells[5].textContent;
    };
}

function displayStudents() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.status === "success") {
                // Clear existing student data
                document.getElementById("studentTableBody").innerHTML = "";

                // Add data to the table
                response.data.forEach(student => {
                    fetchStudentList(student);
                });
            } else {
                console.error("Failed to fetch student data.");
            }
        }
    };

    xhttp.open("POST", "http://127.0.0.1/COMPLETION/", true);
    xhttp.send();
}

function saveStudent() {
    // Get form data
    var idnumber = document.getElementById("idnumber").value;
    var lastname = document.getElementById("lastname").value;
    var firstname = document.getElementById("firstname").value;
    var middlename = document.getElementById("middlename").value;
    var contactnumber = document.getElementById("contactnumber").value;
    var email = document.getElementById("email").value;

    // AJAX request to save data
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.data && response.data.title) {
                alert(response.data.title);
            } else {
                alert("Success!");
                // Clear form fields
                document.getElementById("studentForm").reset();
                // Add new row to the table
                fetchStudentList({
                    idNumber: idnumber,
                    lastName: lastname,
                    firstName: firstname,
                    middleName: middlename,
                    contactNumber: contactnumber,
                    email: email
                });
            }
        }
    }
    xhttp.open("POST", "http://127.0.0.1/COMPLETION/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        "idNumber": idnumber,
        "lastName": lastname,
        "firstName": firstname,
        "middleName": middlename,
        "contactNumber": contactnumber,
        "email": email
    }));
}

function deleteStudent(idNumber, row) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState == 4 && xhttp.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.status == "success") {
                alert("Student deleted successfully");
                row.remove(); // Remove the row from the table
            } else {
                alert(response.data.title);
            }
        } else {
            alert('Error deleting student');
        }
    }
    xhttp.open("DELETE", "http://127.0.0.1/COMPLETION/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({ "idNumber": idNumber }));
}

function updateStudent(row) {
    // Get updated data from the form
    var idnumber = document.getElementById("idnumber").value;
    var lastname = document.getElementById("lastname").value;
    var firstname = document.getElementById("firstname").value;
    var middlename = document.getElementById("middlename").value;
    var contactnumber = document.getElementById("contactnumber").value;
    var email = document.getElementById("email").value;

    // AJAX request to save updated data
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.status === "success") {
                alert("Student updated successfully");
                // Update the table with the new data
                const cells = row.getElementsByTagName('td');
                cells[0].textContent = idnumber;
                cells[1].textContent = lastname;
                cells[2].textContent = firstname;
                cells[3].textContent = middlename;
                cells[4].textContent = contactnumber;
                cells[5].textContent = email;
            } else {
                alert("Failed to update student");
            }
        }
    };
    xhttp.open("PUT", "http://127.0.0.1/COMPLETION/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        "idNumber": idnumber,
        "lastName": lastname,
        "firstName": firstname,
        "middleName": middlename,
        "contactNumber": contactnumber,
        "email": email
    }));
}

function fetchStudentList(student) {
    const newRow = `<tr>
        <td>${student.idNumber}</td>
        <td>${student.lastName}</td>
        <td>${student.firstName}</td>
        <td>${student.middleName}</td>
        <td>${student.contactNumber}</td>
        <td>${student.email}</td>
        <td>
            <button class="btn btn-primary btn-sm edit" data-id="${student.idNumber}" onclick="editRow(this)">Edit</button>
            <button class="btn btn-success btn-sm update" data-id="${student.idNumber}" onclick="updateRow(this)">Update</button>
            <button class="btn btn-danger btn-sm delete" data-id="${student.idNumber}" onclick="deleteRow(this)">Delete</button>
        </td>
    </tr>`;
    document.getElementById("studentTableBody").innerHTML += newRow;
}
