const backendURL = "http://localhost:8090";


const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("emailAddress").value;
        const password = document.getElementById("password").value;

        fetch(backendURL + "/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailAddress: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(user => {
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "ADMIN") {
                window.location.href = "adminDashboard.html";
            } else {
                window.location.href = "employeeDashboard.html";
            }

        })

        .catch(error => {
            console.log(error);
            alert("Invalid Login");
        });
    });
}

const reportForm = document.getElementById("report-form");

if (reportForm) {

    reportForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const loggedUser = JSON.parse(localStorage.getItem("user"));

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const severity = document.getElementById("severity").value;
        const location = document.getElementById("location").value;

        const incident = {
            title: title,
            incidentDescription: description,
            severity: severity,
            incidentCategory: location,
            status: "Open",
            reporter: loggedUser.userId
        };

        fetch(backendURL + "/incidents/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(incident)
        })
        .then(res => res.json())
        .then(data => {
            alert("Incident Submitted");
            window.location.href = "myIncidents.html";
        })

        .catch(error => {
            console.log(error);
            alert("Failed To Submit Incident");
        });

    });

}

const adminTable = document.getElementById("admin-table");

if (adminTable) {

    fetch(backendURL + "/incidents/all")

    .then(res => res.json())
    .then(data => {
        let total = data.length;
        let open = 0;
        let resolved = 0;
        let critical = 0;

        for (let i = 0; i < data.length; i++) {

            if (data[i].status === "Open") {
                open++;
            }
            if (data[i].status === "Resolved") {
                resolved++;
            }
            if (data[i].severity === "Critical") {
                critical++;
            }
        }

        const cards = document.getElementsByClassName("card-number");

        cards[0].innerText = total;
        cards[1].innerText = open;
        cards[2].innerText = critical;
        cards[3].innerText = resolved;

        adminTable.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Location</th>
            </tr>
        `;

        for (let i = 0; i < data.length; i++) {

            adminTable.innerHTML += `
                <tr>
                    <td>${data[i].incidentId}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].severity}</td>
                    <td>${data[i].status}</td>
                    <td>${data[i].incidentCategory}</td>
                </tr>
            `;

        }

    });

}

const allIncidentsTable = document.getElementById("all-incidents-table");

if (allIncidentsTable) {
    fetch(backendURL + "/incidents/all")
    .then(res => res.json())
    .then(data => {
        allIncidentsTable.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reporter</th>
            </tr>
        `;

        for (let i = 0; i < data.length; i++) {
            allIncidentsTable.innerHTML += `
                <tr>
                    <td>${data[i].incidentId}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].severity}</td>
                    <td>${data[i].status}</td>
                    <td>${data[i].reporter}</td>
                </tr>
            `;
        }
    });
}

const employeeTable = document.getElementById("employee-table");

if (employeeTable) {

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    fetch(backendURL + "/incidents/all")
    .then(res => res.json())
    .then(data => {
        let myIncidents = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].reporter == loggedUser.userId) {

                myIncidents.push(data[i]);

            }
        }

        let open = 0;
        let resolved = 0;

        for (let i = 0; i < myIncidents.length; i++) {
            if (myIncidents[i].status === "Resolved") {
                resolved++;
            } else {
                open++;
            }

        }

        const cards = document.getElementsByClassName("card-number");

        cards[0].innerText = myIncidents.length;
        cards[1].innerText = open;
        cards[2].innerText = resolved;

        employeeTable.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Severity</th>
            </tr>
        `;

        for (let i = 0; i < myIncidents.length; i++) {

            employeeTable.innerHTML += `
                <tr>
                    <td>${myIncidents[i].incidentId}</td>
                    <td>${myIncidents[i].title}</td>
                    <td>${myIncidents[i].status}</td>
                    <td>${myIncidents[i].severity}</td>
                </tr>
            `;

        }

    });

}

const loggedUser = JSON.parse(localStorage.getItem("user"));

if (loggedUser) {
    if (loggedUser.role === "EMPLOYEE") {
        const adminPages = document.getElementsByClassName("admin-only");

        for (let i = 0; i < adminPages.length; i++) {
            adminPages[i].style.display = "none";
        }
    }

    if (loggedUser.role === "ADMIN") {
        const employeePages = document.getElementsByClassName("employee-only");

        for (let i = 0; i < employeePages.length; i++) {
            employeePages[i].style.display = "none";

        }
    }
}