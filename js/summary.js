/**
 * Populates and updates various summary content elements on a web page.
 *
 * This function retrieves elements with specific IDs from the DOM and populates them with
 * summary data related to tasks and user information. It calculates and displays the total
 * number of tasks, tasks in progress, tasks awaiting feedback, tasks with 'Urgent' priority,
 * task deadlines, tasks to do, tasks marked as done, and a greeting message based on the time of day.
 *
 */
function showSummaryContent() {
    let totalTasks = document.getElementById('tasksInBoard');
    let tasksInProgress = document.getElementById('tasksInProgress');
    let awaitingFeedback = document.getElementById('awaitingFeedback');
    let urgentCount = document.getElementById('urgent');
    let deadlineDate = document.getElementById('deadlineDate');
    let toDo = document.getElementById('toDo');
    let done = document.getElementById('done');
    let greeting = document.getElementById('greeting');
    let name = document.getElementById('name');

    deadlineDate.innerText = getDeadlineTask();
    totalTasks.innerText = user.tasks.length;
    tasksInProgress.innerText = taskCounter('status', 'inProgress');
    awaitingFeedback.innerText = taskCounter('status', 'awaitingFeedback');
    toDo.innerText = taskCounter('status', 'toDo');
    done.innerText = taskCounter('status', 'done');
    name.innerText = user.name;
    urgentCount.innerText = taskCounter('prio', 'Urgent');
    greeting.innerText = getGreetingBasedOnTime();
}


/**
 * Counts the number of tasks that match a specified parameter and value.
 *
 * This function calculates the count of tasks within the user's tasks array that have a specific
 * parameter matching the provided value. It is useful for summarizing tasks based on various criteria,
 * such as their status or priority.
 *
 * @param {string} param -> The parameter to filter tasks by (e.g., 'status', 'prio').
 * @param {string} value -> The value to match within the specified parameter (e.g., 'inProgress', 'Urgent').
 * @returns {number} -> The count of tasks that match the specified parameter and value.
 */
function taskCounter(param, value) {
    let taskCounterValue = 0;
    user.tasks.forEach(task => {
        if (task[param] == value) {
            taskCounterValue++;
        }
    });
    return taskCounterValue;
}


/**
 * Retrieves the formatted due date of the upcoming task, if any.
 *
 * This function calculates and returns the formatted due date of the upcoming task, if there
 * are tasks with due dates in the user's tasks array. It returns "No" if there are no tasks
 * with due dates.
 *
 * @returns {string} -> The formatted due date of the upcoming task or "No" if no tasks have due dates.
 */
function getDeadlineTask() {
    const currentDate = new Date()
    let acutalMinDays = Infinity;
    let upcomingTask = null;
    if (user.tasks.length == 0) {
        return "No";
    } else {
        user.tasks.forEach(task => {
            if (task.duedate) {
                let taskDate = new Date(task.duedate);
                let remainingDays = Math.abs(currentDate - taskDate);
                if (remainingDays < acutalMinDays) {
                    acutalMinDays = remainingDays;
                    upcomingTask = task;
                }
            }
        });
        return formatDate(upcomingTask.duedate);
    }
}


/**
 * Formats a date string in "YYYY-MM-DD" format into a human-readable format.
 *
 * This function takes a date string in "YYYY-MM-DD" format and converts it into a human-readable
 * format like "DD Month, YYYY". It is useful for presenting dates in a more user-friendly manner.
 *
 * @param {string} dateString -> The date string in "YYYY-MM-DD" format to be formatted.
 * @returns {string} -> The formatted date in "DD Month, YYYY" format.
 */
function formatDate(dateString) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JavaScript-Monate sind 0-indexed
    const day = parseInt(dateParts[2]);

    const formattedDate = `${day} ${months[month]}, ${year}`;
    return formattedDate;
}


/**
 * Generates a greeting based on the current time of day.
 *
 * This function calculates the current hour and returns a greeting based on the time of day,
 * including "Good Morning," "Good Afternoon," "Good Evening," or "Good Night."
 *
 * @returns {string} -> A greeting based on the current time of day.
 */
function getGreetingBasedOnTime() {
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour >= 4 && currentHour < 12) {
        greeting = 'Good Morning';
    }
    else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good Afternoon';
    }
    else if (currentHour >= 18 && currentHour < 24) {
        greeting = 'Good Evening';
    }
    else {
        greeting = 'Good Night';
    }

    return greeting;
}


/* ==========================================================================
   Functions to execute on load
   ========================================================================== */

/**
 * Initializes and displays the summary content based on user data.
 *
 * This asynchronous function first retrieves the user's data using `getActualUserData`,
 * and then displays the summary content using `showSummaryContent`.
 */
async function initSummary() {
    await getActualUserData();
    showSummaryContent();
}