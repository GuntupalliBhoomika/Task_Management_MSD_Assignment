const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');
const taskList = document.getElementById('task-list');
const modal = document.getElementById('taskModal');
const selectedDate = document.getElementById('selected-date');
const modalTaskInput = document.getElementById('modal-task');
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let tasks = {};

// Predefined holidays with background images
const holidays = {
    "1-1": { name: "New Year's Day", className: 'newyear' },
    "1-14": { name: "Sankranthi", className: 'sankranthi' },
    "2-14": { name: "Valentine's Day", className: 'valentines' },
    "4-13": { name: "Ugadi", className: 'ugadi' }
};

// Load Calendar
function loadCalendar(month, year) {
    calendar.innerHTML = '';
    monthYear.innerText = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

    let firstDay = new Date(year, month, 1).getDay() - 1;
    if (firstDay === -1) firstDay = 6; // Adjust for Monday start

    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += `<div class="day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dateKey = `${month + 1}-${day}`;
        let holidayClass = holidays[dateKey] ? holidays[dateKey].className : '';
        let taskClass = tasks[`${year}-${month + 1}-${day}`] ? 'task-day' : '';

        calendar.innerHTML += `<div class="day ${holidayClass} ${taskClass}" data-date="${year}-${month + 1}-${day}">${day}</div>`;
    }

    document.querySelectorAll('.day').forEach(day => {
        day.addEventListener('click', openTaskModal);
    });
}

// Open Modal for Task Addition
function openTaskModal(e) {
    const date = e.target.getAttribute('data-date');
    selectedDate.innerText = date;
    modalTaskInput.value = '';
    modal.style.display = 'block';
}

// Close Modal
document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Add Task in Modal
document.getElementById('modal-add-task-btn').addEventListener('click', () => {
    const date = selectedDate.innerText;
    const taskDescription = modalTaskInput.value;

    if (taskDescription) {
        tasks[date] = taskDescription;
        updateTaskList(date, taskDescription);
        loadCalendar(currentMonth, currentYear);
        modal.style.display = 'none';
    }
});

// Update the Task List View
function updateTaskList(date, task) {
    const taskListItem = document.createElement('div');
    taskListItem.className = 'task-list-item';
    taskListItem.innerHTML = `<strong>${date}:</strong> ${task}
    <button class="mark-done-btn">Mark as Done</button>
    <button class="delete-task-btn">Delete Task</button>`;
    taskList.appendChild(taskListItem);

    // Add event listeners for mark as done and delete
    taskListItem.querySelector('.mark-done-btn').addEventListener('click', () => markTaskAsDone(date, taskListItem));
    taskListItem.querySelector('.delete-task-btn').addEventListener('click', () => deleteTask(date, taskListItem));
}

// Mark task as done
function markTaskAsDone(date, taskListItem) {
    taskListItem.classList.add('task-done');
    taskListItem.style.backgroundColor = 'pink'; // Change background color to pink
    taskListItem.querySelector('.delete-task-btn').style.display = 'none'; 
    taskListItem.querySelector('.delete-task-btn').style.display = 'inline-block';
    // Update calendar
    const calendarDay = document.querySelector(`.day[data-date="${date}"]`);
    if (calendarDay) {
        calendarDay.classList.add('task-completed');
        calendarDay.style.backgroundColor = 'pink'; // Change background color to pink
        calendarDay.setAttribute('title', 'Task Completed'); // Set hover text via JavaScript
    }

    // Update tasks object
    tasks[date] += ' (Done)';
}

// Delete task
function deleteTask(date, taskListItem) {
    // Remove from task list
    taskList.removeChild(taskListItem);

    // Update calendar
    const calendarDay = document.querySelector(`.day[data-date="${date}"]`);
    if (calendarDay) {
        calendarDay.classList.remove('task-completed');
        calendarDay.classList.remove('task-day');
        calendarDay.title = '';
    }

    // Update tasks object
    delete tasks[date];
}

// Navigate to Previous Month
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar(currentMonth, currentYear);
});

// Navigate to Next Month
document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar(currentMonth, currentYear);
});

// Load the initial calendar
loadCalendar(currentMonth, currentYear);
