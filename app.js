const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];

function promptUser() {
    return (
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "input",
                    message: "Employee name:",
                    default: "Employee Name",
                },
                {
                    name: "role",
                    type: "list",
                    choices: ["Manager", "Engineer", "Intern"],
                    message: "Please write your employee role.",
                },
                {
                    name: "id",
                    type: "input",
                    message: "Employee Id:",
                    default: "Employee ID",
                },
                {
                    name: "email",
                    type: "input",
                    message: "Employee email:",
                    default: "Employee Email",
                },
                {
                    name: "office",
                    type: "input",
                    message: "Write the Managers office number",
                    when: (userInput) => userInput.role === "Manager",
                },
                {
                    name: "github",
                    type: "input",
                    message: "What is the Engineer's GitHub username?",
                    when: (userInput) => userInput.role === "Engineer",
                },
                {
                    name: "school",
                    type: "input",
                    message: "What school did the intern go to?",
                    when: (userInput) => userInput.role === "Intern",
                },
                {
                    name: "newEmployee",
                    type: "confirm",
                    message: "Would you like to add another employee?",
                },
            ])
            .then((answers) => {
                switch (answers.role) {
                    case "Manager": {
                        employees.push(
                            new Manager(
                                answers.name,
                                answers.id,
                                answers.email,
                                answers.office
                            )
                        );
                        break;
                    }
                    case "Engineer": {
                        employees.push(
                            new Engineer(
                                answers.name,
                                answers.id,
                                answers.email,
                                answers.github
                            )
                        );
                        break;
                    }
                    case "Intern":
                        employees.push(
                            new Intern(
                                answers.name,
                                answers.id,
                                answers.email,
                                answers.school
                            )
                        );
                        break;
                }
                if (answers.newEmployee === true) {
                    promptUser();
                } else {
                    const html = render(employees);
                    renderHtml(html);
                }
            })
    );
}
const renderHtml = (html) => {
    fs.access(OUTPUT_DIR, function (error) {
        if (error) {
            console.log("Directory does not exist. Making new directory.");
            fs.mkdir(OUTPUT_DIR, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`successfully created directory.`);
                    writeHtml(html);
                }
            });
        } else {
            writeHtml(html);
        }
    });
};
const writeHtml = (html) => {
    fs.writeFile(outputPath, html, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("wrote team.html , success!");
        }
    });
};

promptUser();