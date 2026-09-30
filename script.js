/* =====================================================
   BETTER ME — 92 DAY JOURNEY
   Complete frontend logic
===================================================== */


/* =====================================================
   SETTINGS
===================================================== */

const TOTAL_DAYS = 92;


/* =====================================================
   DEFAULT DATA
===================================================== */

const defaultData = {
    name: "Gomathi",

    startDate: null,

    completedDays: [],

    currentDay: 1,

    bestStreak: 0,

    semesterMode: false,

    tasks: {},

    goalsCompleted: 0
};


/* =====================================================
   LOAD DATA
===================================================== */

let data = JSON.parse(
    localStorage.getItem("betterMe92")
) || { ...defaultData };


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "betterMe92",
        JSON.stringify(data)
    );

}


/* =====================================================
   INITIALIZE START DATE
===================================================== */

function initializeStartDate() {

    if (!data.startDate) {

        data.startDate = new Date().toISOString();

        saveData();

    }

}


/* =====================================================
   CALCULATE CURRENT DAY
===================================================== */

function calculateCurrentDay() {

    if (!data.startDate) {
        return 1;
    }

    const start = new Date(data.startDate);

    const today = new Date();

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference =
        Math.floor(
            (today - start) /
            (1000 * 60 * 60 * 24)
        );

    return Math.min(
        Math.max(difference + 1, 1),
        TOTAL_DAYS
    );

}


/* =====================================================
   TASK LIST
===================================================== */

const taskNames = [
    "java",
    "sql",
    "english",
    "words",
    "movement",
    "reflection"
];


/* =====================================================
   GET TODAY TASKS
===================================================== */

function getTodayTasks() {

    const day = data.currentDay;

    if (!data.tasks[day]) {

        data.tasks[day] = {};

        taskNames.forEach(task => {
            data.tasks[day][task] = false;
        });

        saveData();
    }

    return data.tasks[day];

}


/* =====================================================
   NAVIGATION
===================================================== */

const navItems = document.querySelectorAll(
    ".nav-item, .mobile-nav-item"
);

const pages = document.querySelectorAll(".page");


function openPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage =
        document.getElementById(
            pageName + "Page"
        );

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageName) {
            item.classList.add("active");
        }

    });


    const titles = {
        home: "Good evening 👋",
        today: "Today's Journey",
        progress: "Your Progress",
        streak: "Your Streak 🔥",
        profile: "Your Profile"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageName];


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        openPage(item.dataset.page);

    });

});


/* =====================================================
   DATA-GO BUTTONS
===================================================== */

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.go);

    });

});


/* =====================================================
   UPDATE DAY
===================================================== */

function updateDay() {

    data.currentDay = calculateCurrentDay();

    document.getElementById("heroDay").textContent =
        data.currentDay;

    document.getElementById("todayDay").textContent =
        data.currentDay;

}


/* =====================================================
   TASK CHECKING
===================================================== */

function setupTasks() {

    const tasks = getTodayTasks();

    document.querySelectorAll(".task").forEach(taskElement => {

        const taskName =
            taskElement.dataset.task;

        const button =
            taskElement.querySelector(".check-button");


        if (tasks[taskName]) {

            taskElement.classList.add("completed");

        }


        button.addEventListener("click", () => {

            tasks[taskName] =
                !tasks[taskName];

            taskElement.classList.toggle(
                "completed",
                tasks[taskName]
            );

            saveData();

            updateAll();

        });

    });

}


/* =====================================================
   TODAY PROGRESS
===================================================== */

function getTodayCompletedCount() {

    const tasks = getTodayTasks();

    return taskNames.filter(
        task => tasks[task]
    ).length;

}


function updateTodayProgress() {

    const completed =
        getTodayCompletedCount();

    const total =
        taskNames.length;

    const percent =
        Math.round(
            (completed / total) * 100
        );


    document.getElementById(
        "dailyProgressText"
    ).textContent =
        `${completed} / ${total} completed`;


    document.getElementById(
        "dailyProgressPercent"
    ).textContent =
        percent + "%";


    document.getElementById(
        "dailyProgressFill"
    ).style.width =
        percent + "%";


    document.getElementById(
        "todayPercent"
    ).textContent =
        percent;


    document.getElementById(
        "heroProgress"
    ).textContent =
        percent + "%";

}


/* =====================================================
   COMPLETE DAY
===================================================== */

document.getElementById(
    "completeDay"
).addEventListener("click", () => {

    const completed =
        getTodayCompletedCount();


    if (completed < taskNames.length) {

        showToast(
            "Almost there!",
            `Complete all ${taskNames.length} tasks first.`
        );

        return;

    }


    if (!data.completedDays.includes(data.currentDay)) {

        data.completedDays.push(
            data.currentDay
        );

        data.goalsCompleted +=
            taskNames.length;

        updateBestStreak();

        saveData();

        showToast(
            "Day completed! ✨",
            "Another step towards your better self."
        );

        updateAll();

    } else {

        showToast(
            "Already completed 💚",
            "You already completed this day."
        );

    }

});


/* =====================================================
   STREAK CALCULATION
===================================================== */

function calculateStreak() {

    const completed =
        [...data.completedDays]
        .sort((a, b) => a - b);


    if (completed.length === 0) {
        return 0;
    }


    let streak = 1;


    for (
        let i = completed.length - 1;
        i > 0;
        i--
    ) {

        if (
            completed[i] -
            completed[i - 1] === 1
        ) {

            streak++;

        } else {

            break;

        }

    }


    return streak;

}


function updateBestStreak() {

    const streak =
        calculateStreak();

    if (streak > data.bestStreak) {

        data.bestStreak =
            streak;

    }

}


/* =====================================================
   OVERALL PROGRESS
===================================================== */

function updateOverallProgress() {

    const completed =
        data.completedDays.length;

    const percent =
        Math.round(
            (completed / TOTAL_DAYS) * 100
        );


    document.getElementById(
        "overallProgress"
    ).textContent =
        percent + "%";


    document.getElementById(
        "progressDays"
    ).textContent =
        completed;


    document.getElementById(
        "daysCompleted"
    ).textContent =
        completed;


    document.getElementById(
        "overallProgressBar"
    ).style.width =
        percent + "%";


    /* Circle */

    const degrees =
        (percent / 100) * 360;

    document.querySelector(
        ".big-progress-circle"
    ).style.background =
        `conic-gradient(
            var(--purple) ${degrees}deg,
            #eeece8 ${degrees}deg
        )`;


    /* Headline */

    let headline =
        "You're just getting started.";

    if (percent >= 25) {
        headline =
            "You're building momentum.";
    }

    if (percent >= 50) {
        headline =
            "Look how far you've come.";
    }

    if (percent >= 75) {
        headline =
            "You're becoming unstoppable.";
    }

    if (percent === 100) {
        headline =
            "You made it. 🌟";
    }

    document.getElementById(
        "progressHeadline"
    ).textContent =
        headline;

}


/* =====================================================
   CATEGORY SCORES
===================================================== */

function updateCategoryScores() {

    const completed =
        data.completedDays.length;


    const percentage =
        Math.round(
            (completed / TOTAL_DAYS) * 100
        );


    document.getElementById(
        "careerScore"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "englishScore"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "personalScore"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "careerBar"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "englishBar"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "personalBar"
    ).style.width =
        percentage + "%";

}


/* =====================================================
   STREAK UI
===================================================== */

function updateStreakUI() {

    const streak =
        calculateStreak();


    document.getElementById(
        "currentStreak"
    ).textContent =
        streak;


    document.getElementById(
        "bigStreak"
    ).textContent =
        streak;


    document.getElementById(
        "streakCurrent"
    ).textContent =
        streak;


    document.getElementById(
        "bestStreak"
    ).textContent =
        data.bestStreak;


    document.getElementById(
        "streakCompleted"
    ).textContent =
        data.completedDays.length;


    document.getElementById(
        "profileStreak"
    ).textContent =
        streak;

}


/* =====================================================
   CALENDAR
===================================================== */

function createCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );

    grid.innerHTML = "";


    for (
        let day = 1;
        day <= TOTAL_DAYS;
        day++
    ) {

        const dot =
            document.createElement("div");

        dot.className =
            "day-dot";


        if (
            data.completedDays.includes(day)
        ) {

            dot.classList.add("done");

        }


        if (
            day === data.currentDay
        ) {

            dot.classList.add("today");

        }


        const number =
            document.createElement("span");

        number.textContent =
            day;

        dot.appendChild(number);

        grid.appendChild(dot);

    }

}


/* =====================================================
   PROFILE
===================================================== */

function updateProfile() {

    document.getElementById(
        "profileName"
    ).textContent =
        data.name;


    document.getElementById(
        "profileDays"
    ).textContent =
        data.completedDays.length;


    document.getElementById(
        "profileGoals"
    ).textContent =
        data.goalsCompleted;

}


/* =====================================================
   EDIT PROFILE NAME
===================================================== */

document.getElementById(
    "editProfile"
).addEventListener("click", () => {

    const newName =
        prompt(
            "What should we call you?",
            data.name
        );


    if (
        newName &&
        newName.trim() !== ""
    ) {

        data.name =
            newName.trim();

        saveData();

        updateProfile();

        showToast(
            "Profile updated ✨",
            `Welcome, ${data.name}!`
        );

    }

});


/* =====================================================
   SEMESTER MODE
===================================================== */

const semesterBanner =
    document.getElementById(
        "semesterBanner"
    );


function updateSemesterUI() {

    semesterBanner.style.display =
        data.semesterMode
            ? "flex"
            : "none";

}


document.getElementById(
    "semesterToggle"
).addEventListener(
    "click",
    () => {

        data.semesterMode =
            !data.semesterMode;

        saveData();

        updateSemesterUI();

        if (data.semesterMode) {

            showToast(
                "Semester Mode ON 🎓",
                "Your studies come first. Keep going gently."
            );

        }

    }
);


document.getElementById(
    "disableSemester"
).addEventListener(
    "click",
    () => {

        data.semesterMode = false;

        saveData();

        updateSemesterUI();

    }
);


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(title, message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.querySelector(
        "strong"
    ).textContent =
        title;


    toast.querySelector(
        "p"
    ).textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =====================================================
   RESET APP
===================================================== */

document.getElementById(
    "resetApp"
).addEventListener(
    "click",
    () => {

        const confirmReset =
            confirm(
                "Are you sure you want to reset your 92-day journey?"
            );


        if (!confirmReset) {
            return;
        }


        localStorage.removeItem(
            "betterMe92"
        );


        location.reload();

    }
);


/* =====================================================
   UPDATE EVERYTHING
===================================================== */

function updateAll() {

    updateDay();

    updateTodayProgress();

    updateOverallProgress();

    updateCategoryScores();

    updateStreakUI();

    updateProfile();

    createCalendar();

    updateSemesterUI();

}


/* =====================================================
   START APP
===================================================== */

initializeStartDate();

data.currentDay =
    calculateCurrentDay();

saveData();

setupTasks();

updateAll();