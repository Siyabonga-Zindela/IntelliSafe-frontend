const BASE_URL = "http://localhost:8080";


const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("emailAddress").value;
        const password = document.getElementById("password").value;

        fetch(BASE_URL + "/admin/1")
            .then(res => res.json())
            .then(admin => {

                if (email === admin.emailAddress && password === admin.password) {
                    localStorage.setItem("user", JSON.stringify(admin));
                    window.location.href = "adminDashboard.html";
                } else {
                    alert("Invalid login");
                }

            })
            .catch(err => {
                console.log(err);
                alert("Server error");
            });
    });
}



const reportForm = document.querySelector("form");

if (reportForm && document.getElementById("detailed-description")) {

    reportForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.querySelector("input[type='text']").value;
        const location = document.getElementById("location").value;
        const description = document.getElementById("detailed-description").value;

        const selected = document.querySelector("input[type='radio']:checked");
        const severity = selected ? selected.value : "low";

        const incident = {
            title: title,
            reporter: 1,
            severity: severity,
            status: "Open",
            date: new Date(),
            incidentDescription: description,
            incidentCategory: location
        };

        fetch(BASE_URL + "/incidents/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(incident)
        })
        .then(res => res.json())
        .then(() => {
            alert("Incident submitted");
            window.location.href = "employeeDashboard.html";
        })
        .catch(err => {
            console.log(err);
            alert("Failed to submit");
        });
    });
}



const adminTable = document.getElementById("admin-table-recent-incidents");

if (adminTable) {

    fetch(BASE_URL + "/incidents/all")
        .then(res => res.json())
        .then(data => {

            let total = data.length;
            let critical = 0;
            let open = 0;
            let resolved = 0;

            for (let i = 0; i < data.length; i++) {
                if (data[i].severity === "critical") critical++;
                if (data[i].status === "Open") open++;
                if (data[i].status === "Resolved") resolved++;
            }

            let cards = document.getElementsByClassName("card-number");

            if (cards.length >= 4) {
                cards[0].innerText = total;
                cards[1].innerText = critical;
                cards[2].innerText = open;
                cards[3].innerText = resolved;
            }

            adminTable.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Reporter</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            `;

            for (let i = 0; i < data.length; i++) {
                adminTable.innerHTML += `
                    <tr>
                        <td>${data[i].incidentId}</td>
                        <td>${data[i].title}</td>
                        <td>${data[i].reporter}</td>
                        <td>${data[i].severity}</td>
                        <td>${data[i].status}</td>
                        <td>${data[i].date}</td>
                    </tr>
                `;
            }

        });
}



const allTable = document.getElementById("admin-table-all-incidents");

if (allTable) {

    fetch(BASE_URL + "/incidents/all")
        .then(res => res.json())
        .then(data => {

            allTable.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Reporter</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            `;

            for (let i = 0; i < data.length; i++) {
                allTable.innerHTML += `
                    <tr>
                        <td>${data[i].incidentId}</td>
                        <td>${data[i].title}</td>
                        <td>${data[i].reporter}</td>
                        <td>${data[i].severity}</td>
                        <td>${data[i].status}</td>
                        <td>${data[i].date}</td>
                    </tr>
                `;
            }

        });
}



const employeeCards = document.getElementsByClassName("card-number");

if (employeeCards.length > 0 && document.getElementById("loggedEmloyee")) {

    fetch(BASE_URL + "/incidents/all")
        .then(res => res.json())
        .then(data => {

            let myIncidents = [];

            for (let i = 0; i < data.length; i++) {
                if (data[i].reporter == 1) {
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

            employeeCards[0].innerText = myIncidents.length;
            employeeCards[1].innerText = open;
            employeeCards[2].innerText = resolved;

        });
}