const existingTasks = [
    { title: 'FSD Assignment', deadline: '2024-10-02', description: 'Creating a website consisting of 5 pages', priority: 'High' },
    { title: 'Study for Exams', deadline: '2024-10-05', description: 'Prepare for upcoming exams', priority: 'Medium' },
    { title: 'Grocery Shopping', deadline: '2024-10-10', description: 'Buy groceries for the week', priority: 'Low' },
    { title: 'Complete Project', deadline: '2024-10-08', description: 'Finish the group project', priority: 'Medium' }
];

let pieChart;

function displayTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    existingTasks.forEach(task => {
        const taskHTML = createTaskHTML(task);
        tasksList.innerHTML += taskHTML;
    });
}

function createTaskHTML(task) {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    let urgencyClass = '';

    if (deadlineDate < now) {
        urgencyClass = 'red';
    } else {
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff <= 3) urgencyClass = 'yellow';
        else if (daysDiff <= 7) urgencyClass = 'orange';
        else urgencyClass = 'green';
    }

    return `
        <div class="task ${urgencyClass}">
            <div class="task-content">
                <div class="task-name">
                    <h4>${task.title}</h4>
                </div>
                <div class="delete-btn" onclick="deleteTask('${task.title}')">
                    <img src="https://img.icons8.com/ios-filled/50/800000/trash.png" alt="Delete" style="width: 20px; height: 20px;"/>
                </div>
            </div>
            <div class="task-deadline">
                <h4>Due Date: ${task.deadline}</h4>
            </div>
            <div class="task-description">
                <p>Description: <strong>${task.description}</strong></p>
            </div>
            <div class="task-priority">
                <h4>Priority: ${task.priority}</h4>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <input type="range" min="0" max="100" value="0" class="progress-slider" onchange="updateProgress(this, '${task.title}')">
                    <div class="progress" style="width: 0%;"></div>
                </div>
                <div class="progress-percentage">0%</div>
            </div>
        </div>
    `;
}

function deleteTask(taskTitle) {
    const taskIndex = existingTasks.findIndex(task => task.title === taskTitle);
    if (taskIndex > -1) {
        existingTasks.splice(taskIndex, 1);
        displayTasks();
        updatePieChart();
    }
}

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const deadline = document.getElementById('deadline').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('priority').value;

    if (title && deadline && description && priority) {
        const newTask = { title, deadline, description, priority };
        existingTasks.push(newTask);
        displayTasks();
        updatePieChart();
        clearForm();
    }
}

function clearForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('priority').value = '';
}

function updateProgress(slider, taskTitle) {
    const progressBar = slider.nextElementSibling;
    const progressPercentage = slider.parentElement.nextElementSibling;
    const value = slider.value;

    progressBar.style.width = `${value}%`;
    progressPercentage.textContent = `${value}%`;

    // If progress reaches 100%, consider the task completed and remove it
    if (value == 100) {
        deleteTask(taskTitle);
    }
}

function searchTasks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tasks = document.getElementsByClassName('task');

    Array.from(tasks).forEach(task => {
        const taskTitle = task.querySelector('.task-name h4').textContent.toLowerCase();
        if (taskTitle.includes(searchInput)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

function updatePieChart() {
    const priorities = { High: 0, Medium: 0, Low: 0 };
    existingTasks.forEach(task => {
        priorities[task.priority]++;
    });

    const data = [priorities.High, priorities.Medium, priorities.Low];

    if (pieChart) {
        pieChart.destroy();
    }

    const ctx = document.getElementById('taskChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data,
                backgroundColor: ['#ff0000', '#ff9900', '#00ff00'],
            }]
        },
        options: {
            responsive: true,
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    displayTasks();
    updatePieChart();
});
