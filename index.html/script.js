
// ========================================
// OUR LITTLE DATE WEBSITE
// ========================================


// ========================================
// SUPABASE
// ========================================

// Your Supabase project URL
const SUPABASE_URL = "https://vvjobodhgoreukhdaayf.supabase.co";

// IMPORTANT:
// Replace ONLY the value below with your Supabase PUBLISHABLE key.
// NEVER put the Supabase SECRET key here.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dTndfgFoAfLwyfVTNcmCyQ_YZp68jMd";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// Each invitation can have its own code.
// Example:
//   yoursite.com/date/index.html?invite=A7K92X
//   yoursite.com/date/index.html?invite=P4M81Q
function getInviteCode() {
    const params = new URLSearchParams(window.location.search);

    // Use A7K92X automatically when no invite code is in the URL.
    return (params.get("invite") || "Forever2024").trim();
}

const INVITE_CODE = getInviteCode();

let isSubmitting = false;


// ========================================
// FIRST MEETING DATE
// ========================================


const firstMeetingDate = "2024-05-28";


// ========================================
// WEBSITE DATA
// ========================================

let selectedActivity = "";
let selectedTime = "";


// ========================================
// CALENDAR DATA
// ========================================

let activeCalendarInput = null;

let dateWheelSelection = {
    year: null,
    month: null,
    day: null
};

let wheelScrollTimers = {};


// ========================================
// CLOCK DATA
// ========================================

let selectedHour = 6;
let selectedMinute = 0;
let selectedAMPM = "PM";
let clockMode = "hour";


// ========================================
// SCREEN NAVIGATION
// ========================================

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const screen = document.getElementById(screenId);

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// DATE HELPERS
// ========================================

function dateToISO(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function isoToDate(iso) {

    if (!iso) {
        return null;
    }

    const parts = iso.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
}


function formatReadableDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


function startOfDay(date) {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


// ========================================
// RELATIONSHIP COUNTER
// ========================================

function updateRelationshipCounter() {

    const counter =
        document.getElementById(
            "relationshipCounter"
        );

    if (!counter) {
        return;
    }

    const start =
        new Date(
            `${firstMeetingDate}T00:00:00`
        );

    const now =
        new Date();

    const difference =
        Math.max(
            0,
            now.getTime() -
            start.getTime()
        );

    const totalSeconds =
        Math.floor(
            difference / 1000
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    counter.textContent =
        `${days} DAYS • ${String(hours).padStart(2, "0")} HOURS • ${String(minutes).padStart(2, "0")} MINUTES • ${String(seconds).padStart(2, "0")} SECONDS`;

    const since =
        document.getElementById(
            "counterSince"
        );

    if (since) {

        since.textContent =
            `Since ${formatReadableDate(start)}`;

    }
}


function startRelationshipCounter() {

    updateRelationshipCounter();

    setInterval(
        updateRelationshipCounter,
        1000
    );
}


// ========================================
// FIRST MEETING DATE
// ========================================

function checkFirstMeetDate() {

    const input =
        document.getElementById(
            "firstMeetDate"
        );

    const result =
        document.getElementById(
            "dateResult"
        );

    if (!input || !result) {
        return;
    }

    const enteredDate =
        input.dataset.value || "";


    // No date selected
    if (!enteredDate) {

        result.textContent =
            "Choose the date first ❤️";

        result.className =
            "date-result wrong";

        return;
    }


    // Correct date
    if (enteredDate === firstMeetingDate) {

        result.textContent =
            "You remembered! 🥹❤️";

        result.className =
            "date-result correct";


        const music =
            document.getElementById(
                "backgroundMusic"
            );

        if (music) {

            music.volume = 0.35;

            music.play().catch(error => {

                console.log(
                    "Music could not start:",
                    error
                );

            });

        }


        setTimeout(() => {

            goToMemory();

        }, 1500);

        return;
    }


    // Wrong date
    result.textContent =
        "Hmm... think again 🥺❤️";

    result.className =
        "date-result wrong";
}


// ========================================
// MEMORY SCREEN
// ========================================

function goToMemory() {

    showScreen("memoryScreen");

}


// ========================================
// DATE QUESTION
// ========================================

function goToDateQuestion() {

    showScreen("dateQuestionScreen");

}


// ========================================
// ACTIVITY SCREEN
// ========================================

function goToActivities() {

    showScreen("activityScreen");

}


// ========================================
// BACK BUTTON
// ========================================

function goBack(screenId) {

    showScreen(screenId);

}


// ========================================
// ACTIVITY SELECTION
// ========================================

function selectActivity(element, activity) {

    document
        .querySelectorAll(".activity-card")
        .forEach(card => {

            card.classList.remove("selected");

        });


    element.classList.add("selected");


    selectedActivity =
        activity;


    document
        .getElementById("activityContinue")
        .disabled = false;

}


// ========================================
// GO TO DATE SCREEN
// ========================================

function goToDate() {

    if (!selectedActivity) {
        return;
    }

    setupDatePicker();

    showScreen("dateScreen");

}


// ========================================
// FIRST MEETING DATE SETUP
// ========================================

function setupFirstMeetDate() {

    const input =
        document.getElementById(
            "firstMeetDate"
        );

    if (!input) {
        return;
    }

}


// ========================================
// OPEN VERTICAL DATE PICKER
// ========================================

function openCalendar(inputId) {

    const input =
        document.getElementById(
            inputId
        );

    if (!input) {
        return;
    }


    activeCalendarInput =
        inputId;


    const today =
        startOfDay(
            new Date()
        );


    let selectedDate;


    if (input.dataset.value) {

        selectedDate =
            isoToDate(
                input.dataset.value
            );

    } else {

        selectedDate =
            new Date(today);

    }


    const limits =
        getCalendarLimits();


    // Keep selected date inside allowed range
    if (
        selectedDate <
        limits.min
    ) {

        selectedDate =
            new Date(limits.min);

    }


    if (
        selectedDate >
        limits.max
    ) {

        selectedDate =
            new Date(limits.max);

    }


    dateWheelSelection = {

        year:
            selectedDate.getFullYear(),

        month:
            selectedDate.getMonth(),

        day:
            selectedDate.getDate()

    };


    setupDateWheels();


    const overlay =
        document.getElementById(
            "calendarOverlay"
        );

    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    document.body.style.overflow =
        "hidden";

}


// ========================================
// CLOSE DATE PICKER
// ========================================

function closeCalendar() {

    const overlay =
        document.getElementById(
            "calendarOverlay"
        );

    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

    activeCalendarInput =
        null;

    document.body.style.overflow =
        "";

}


// ========================================
// CALENDAR LIMITS
// ========================================

function getCalendarLimits() {

    const today =
        startOfDay(
            new Date()
        );


    // First meeting date
    if (
        activeCalendarInput ===
        "firstMeetDate"
    ) {

        return {

            // Allow dates from 1000 years ago
            // so June 22, 2026 is definitely selectable
            min: new Date(
                today.getFullYear() - 1000,
                today.getMonth(),
                today.getDate()
            ),

            max: today

        };

    }


    // Future date picker
    if (
        activeCalendarInput ===
        "datePicker"
    ) {

        const maxDate =
            new Date(today);

        maxDate.setMonth(
            maxDate.getMonth() + 6
        );


        return {

            min: today,

            max: maxDate

        };

    }


    return {

        min: null,

        max: null

    };

}


// ========================================
// CHECK DATE ALLOWED
// ========================================

function isDateAllowed(date) {

    const limits =
        getCalendarLimits();

    const current =
        startOfDay(date);


    if (
        limits.min &&
        current < limits.min
    ) {

        return false;

    }


    if (
        limits.max &&
        current > limits.max
    ) {

        return false;

    }


    return true;

}


// ========================================
// AVAILABLE YEARS
// ========================================

function getAvailableYears() {

    const limits =
        getCalendarLimits();

    const years = [];


    if (
        !limits.min ||
        !limits.max
    ) {

        return years;

    }


    for (
        let year =
            limits.min.getFullYear();

        year <=
            limits.max.getFullYear();

        year++
    ) {

        const yearStart =
            new Date(
                year,
                0,
                1
            );

        const yearEnd =
            new Date(
                year,
                11,
                31
            );


        if (
            yearEnd >= limits.min &&
            yearStart <= limits.max
        ) {

            years.push(year);

        }

    }


    return years;

}


// ========================================
// AVAILABLE MONTHS
// ========================================

function getAvailableMonths(year) {

    const limits =
        getCalendarLimits();

    const months = [];


    for (
        let month = 0;
        month < 12;
        month++
    ) {

        const monthStart =
            new Date(
                year,
                month,
                1
            );

        const monthEnd =
            new Date(
                year,
                month + 1,
                0
            );


        if (
            monthEnd >= limits.min &&
            monthStart <= limits.max
        ) {

            months.push(month);

        }

    }


    return months;

}


// ========================================
// AVAILABLE DAYS
// ========================================

function getAvailableDays(
    year,
    month
) {

    const limits =
        getCalendarLimits();

    const days = [];


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let day = 1;
        day <= lastDay;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        if (
            date >= limits.min &&
            date <= limits.max
        ) {

            days.push(day);

        }

    }


    return days;

}


// ========================================
// CLAMP DATE SELECTION
// ========================================

function clampDateWheelSelection() {

    const years =
        getAvailableYears();


    if (!years.length) {
        return;
    }


    // YEAR
    if (
        !years.includes(
            dateWheelSelection.year
        )
    ) {

        dateWheelSelection.year =
            years[
                Math.max(
                    0,
                    years.indexOf(
                        dateWheelSelection.year
                    )
                )
            ];

        if (
            !years.includes(
                dateWheelSelection.year
            )
        ) {

            dateWheelSelection.year =
                years[0];

        }

    }


    const months =
        getAvailableMonths(
            dateWheelSelection.year
        );


    // MONTH
    if (
        !months.includes(
            dateWheelSelection.month
        )
    ) {

        let closestMonth =
            months[0];


        for (
            const month of months
        ) {

            if (
                month <=
                dateWheelSelection.month
            ) {

                closestMonth =
                    month;

            }

        }


        dateWheelSelection.month =
            closestMonth;

    }


    const days =
        getAvailableDays(
            dateWheelSelection.year,
            dateWheelSelection.month
        );


    // DAY
    if (
        !days.includes(
            dateWheelSelection.day
        )
    ) {

        let closestDay =
            days[days.length - 1];


        for (
            const day of days
        ) {

            if (
                day <=
                dateWheelSelection.day
            ) {

                closestDay =
                    day;

            }

        }


        dateWheelSelection.day =
            closestDay;

    }

}


// ========================================
// SETUP DATE WHEELS
// ========================================

function setupDateWheels() {

    clampDateWheelSelection();

    renderAllDateWheels();

    updateCalendarPreview();

}


// ========================================
// RENDER ALL WHEELS
// ========================================

function renderAllDateWheels() {

    renderDateWheel(
        "year",
        getAvailableYears(),
        value => value
    );


    renderDateWheel(
        "month",
        getAvailableMonths(
            dateWheelSelection.year
        ),
        value => {

            return new Date(
                2000,
                value,
                1
            ).toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            );

        }
    );


    renderDateWheel(
        "day",
        getAvailableDays(
            dateWheelSelection.year,
            dateWheelSelection.month
        ),
        value => String(value).padStart(2, "0")
    );

}


// ========================================
// RENDER ONE WHEEL
// ========================================

function renderDateWheel(
    type,
    values,
    formatter
) {

    const wheel =
        document.getElementById(
            `${type}Wheel`
        );


    if (!wheel) {
        return;
    }


    wheel.innerHTML = "";


    values.forEach(value => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "wheel-item";

        button.dataset.value =
            value;

        button.textContent =
            formatter(value);


        if (
            value ===
            dateWheelSelection[type]
        ) {

            button.classList.add(
                "selected"
            );

        }


        button.addEventListener(
            "click",
            function() {

                setDateWheelValue(
                    type,
                    value
                );


                requestAnimationFrame(() => {

                    scrollWheelToSelected(
                        type
                    );

                });

            }
        );


        wheel.appendChild(
            button
        );

    });


    attachWheelScroll(type);


    requestAnimationFrame(() => {

        scrollWheelToSelected(
            type
        );

    });

}


// ========================================
// SCROLL SELECTED VALUE
// ========================================

function scrollWheelToSelected(type) {

    const wheel =
        document.getElementById(
            `${type}Wheel`
        );


    if (!wheel) {
        return;
    }


    const selected =
        wheel.querySelector(
            ".wheel-item.selected"
        );


    if (!selected) {
        return;
    }


    selected.scrollIntoView({

        behavior: "auto",

        block: "center"

    });

}


// ========================================
// GET CENTERED WHEEL ITEM
// ========================================

function getCenteredWheelValue(type) {

    const wheel =
        document.getElementById(
            `${type}Wheel`
        );


    if (!wheel) {
        return null;
    }


    const items =
        [
            ...wheel.querySelectorAll(
                ".wheel-item"
            )
        ];


    if (!items.length) {
        return null;
    }


    const wheelRect =
        wheel.getBoundingClientRect();


    const centerY =
        wheelRect.top +
        wheelRect.height / 2;


    let closestItem =
        null;

    let closestDistance =
        Infinity;


    items.forEach(item => {

        const rect =
            item.getBoundingClientRect();


        const itemCenter =
            rect.top +
            rect.height / 2;


        const distance =
            Math.abs(
                itemCenter -
                centerY
            );


        if (
            distance <
            closestDistance
        ) {

            closestDistance =
                distance;

            closestItem =
                item;

        }

    });


    if (!closestItem) {
        return null;
    }


    return Number(
        closestItem.dataset.value
    );

}


// ========================================
// WHEEL SCROLL DETECTION
// ========================================

function attachWheelScroll(type) {

    const wheel =
        document.getElementById(
            `${type}Wheel`
        );


    if (!wheel) {
        return;
    }


    wheel.onscroll =
        function() {

            clearTimeout(
                wheelScrollTimers[type]
            );


            wheelScrollTimers[type] =
                setTimeout(() => {

                    const value =
                        getCenteredWheelValue(
                            type
                        );


                    if (
                        value === null
                    ) {

                        return;

                    }


                    setDateWheelValue(
                        type,
                        value
                    );


                    requestAnimationFrame(() => {

                        scrollWheelToSelected(
                            type
                        );

                    });

                }, 120);

        };

}


// ========================================
// SET WHEEL VALUE
// ========================================

function setDateWheelValue(
    type,
    value
) {

    if (!activeCalendarInput) {
        return;
    }


    dateWheelSelection[type] =
        value;


    // YEAR CHANGED
    if (
        type === "year"
    ) {

        clampDateWheelSelection();


        renderDateWheel(
            "month",
            getAvailableMonths(
                dateWheelSelection.year
            ),
            value => {

                return new Date(
                    2000,
                    value,
                    1
                ).toLocaleDateString(
                    "en-US",
                    {
                        month: "short"
                    }
                );

            }
        );


        renderDateWheel(
            "day",
            getAvailableDays(
                dateWheelSelection.year,
                dateWheelSelection.month
            ),
            value =>
                String(value).padStart(2, "0")
        );

    }


    // MONTH CHANGED
    if (
        type === "month"
    ) {

        clampDateWheelSelection();


        renderDateWheel(
            "day",
            getAvailableDays(
                dateWheelSelection.year,
                dateWheelSelection.month
            ),
            value =>
                String(value).padStart(2, "0")
        );

    }


    clampDateWheelSelection();


    // Update all selected classes
    updateSelectedWheelStyles(
        "year"
    );

    updateSelectedWheelStyles(
        "month"
    );

    updateSelectedWheelStyles(
        "day"
    );


    updateCalendarPreview();

}


// ========================================
// UPDATE SELECTED WHEEL
// ========================================

function updateSelectedWheelStyles(type) {

    const wheel =
        document.getElementById(
            `${type}Wheel`
        );


    if (!wheel) {
        return;
    }


    wheel
        .querySelectorAll(
            ".wheel-item"
        )
        .forEach(item => {

            item.classList.toggle(

                "selected",

                Number(
                    item.dataset.value
                ) ===
                dateWheelSelection[type]

            );

        });

}


// ========================================
// MOVE WHEEL WITH ARROWS
// ========================================

function moveDateWheel(
    type,
    direction
) {

    let values;


    if (
        type === "year"
    ) {

        values =
            getAvailableYears();

    }

    else if (
        type === "month"
    ) {

        values =
            getAvailableMonths(
                dateWheelSelection.year
            );

    }

    else {

        values =
            getAvailableDays(
                dateWheelSelection.year,
                dateWheelSelection.month
            );

    }


    const currentIndex =
        values.indexOf(
            dateWheelSelection[type]
        );


    if (
        currentIndex === -1
    ) {

        return;

    }


    const newIndex =
        Math.max(
            0,
            Math.min(
                values.length - 1,
                currentIndex + direction
            )
        );


    setDateWheelValue(
        type,
        values[newIndex]
    );


    requestAnimationFrame(() => {

        scrollWheelToSelected(
            type
        );

    });

}


// ========================================
// CURRENT WHEEL DATE
// ========================================

function getCurrentWheelDate() {

    return new Date(
        dateWheelSelection.year,
        dateWheelSelection.month,
        dateWheelSelection.day
    );

}


// ========================================
// UPDATE CALENDAR PREVIEW
// ========================================

function updateCalendarPreview() {

    const monthTitle =
        document.getElementById(
            "calendarMonth"
        );


    const selectedText =
        document.getElementById(
            "calendarSelectedText"
        );


    const date =
        getCurrentWheelDate();


    if (monthTitle) {

        monthTitle.textContent =
            date.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            );

    }


    if (selectedText) {

        selectedText.textContent =
            formatReadableDate(
                date
            );

    }

}


// ========================================
// CONFIRM SELECTED DATE
// ========================================

function confirmCalendarSelection() {

    if (!activeCalendarInput) {
        return;
    }


    const date =
        getCurrentWheelDate();


    if (
        !isDateAllowed(date)
    ) {

        return;

    }


    const input =
        document.getElementById(
            activeCalendarInput
        );


    if (!input) {
        return;
    }


    // Convert selected date to YYYY-MM-DD
    const iso =
        dateToISO(date);


    // THIS IS IMPORTANT
    // Store the selected date
    input.dataset.value =
        iso;


    // Show readable date
    input.value =
        formatReadableDate(
            date
        );


    closeCalendar();

}


// ========================================
// BACKWARD COMPATIBILITY
// ========================================

// If your HTML still uses:
// onclick="confirmCalendarDate()"
// it will also work.

function confirmCalendarDate() {

    confirmCalendarSelection();

}


// ========================================
// DATE KEYBOARD
// ========================================

function setupDateKeyboard() {

    const inputs =
        document.querySelectorAll(
            ".custom-date-input"
        );


    inputs.forEach(input => {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Backspace" ||
                    event.key === "Delete"
                ) {

                    this.value =
                        "";

                    this.dataset.value =
                        "";

                    event.preventDefault();

                }


                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    openCalendar(
                        this.id
                    );

                }

            }
        );


        input.addEventListener(
            "click",
            function() {

                openCalendar(
                    this.id
                );

            }
        );

    });

}


// ========================================
// ACTUAL DATE PICKER
// ========================================

function setupDatePicker() {

    const dateInput =
        document.getElementById(
            "datePicker"
        );


    if (!dateInput) {
        return;
    }


    const today =
        startOfDay(
            new Date()
        );


    const maxDate =
        new Date(today);


    maxDate.setMonth(
        maxDate.getMonth() + 6
    );


    const rangeText =
        document.getElementById(
            "rangeText"
        );


    if (rangeText) {

        rangeText.textContent =
            `Available from ${formatReadableDate(today)} to ${formatReadableDate(maxDate)}`;

    }


    dateInput.value =
        "";

    dateInput.dataset.value =
        "";


    selectedTime =
        "";

    selectedHour =
        6;

    selectedMinute =
        0;

    selectedAMPM =
        "PM";

    clockMode =
        "hour";


    updateClockDisplay();

    renderClock();

}


// ========================================
// GO TO TIME
// ========================================

function goToTime() {

    const dateInput =
        document.getElementById(
            "datePicker"
        );


    if (
        !dateInput ||
        !dateInput.dataset.value
    ) {

        alert(
            "Please choose a date ❤️"
        );

        return;

    }


    updateClockDisplay();

    renderClock();


    showScreen(
        "timeScreen"
    );

}


// ========================================
// CLOCK MODE
// ========================================

function setClockMode(mode) {

    clockMode =
        mode;


    const hourButton =
        document.getElementById(
            "hourModeButton"
        );


    const minuteButton =
        document.getElementById(
            "minuteModeButton"
        );


    if (hourButton) {

        hourButton.classList.toggle(
            "active",
            mode === "hour"
        );

    }


    if (minuteButton) {

        minuteButton.classList.toggle(
            "active",
            mode === "minute"
        );

    }


    const hint =
        document.getElementById(
            "clockHint"
        );


    if (hint) {

        if (
            mode === "hour"
        ) {

            hint.textContent =
                "Choose an hour";

        }

        else {

            hint.textContent =
                "Choose the minutes";

        }

    }


    renderClock();

}


// ========================================
// AM / PM
// ========================================

function selectAMPM(value) {

    selectedAMPM =
        value;


    const amButton =
        document.getElementById(
            "amButton"
        );

    const pmButton =
        document.getElementById(
            "pmButton"
        );


    if (amButton) {

        amButton.classList.toggle(
            "active",
            value === "AM"
        );

    }


    if (pmButton) {

        pmButton.classList.toggle(
            "active",
            value === "PM"
        );

    }


    updateClockDisplay();

    updateSelectedTime();

}


// ========================================
// RENDER CLOCK
// ========================================

function renderClock() {

    const clock =
        document.getElementById(
            "clockFace"
        );


    if (!clock) {
        return;
    }


    clock
        .querySelectorAll(
            ".clock-number, .clock-hand"
        )
        .forEach(element => {

            element.remove();

        });


    const hand =
        document.createElement(
            "div"
        );


    hand.className =
        "clock-hand";


    clock.appendChild(
        hand
    );


    if (
        clockMode === "hour"
    ) {

        renderHourClock(
            clock
        );

    }

    else {

        renderMinuteClock(
            clock
        );

    }


    updateClockHand();

}


// ========================================
// HOUR CLOCK
// ========================================

function renderHourClock(clock) {

    for (
        let hour = 1;
        hour <= 12;
        hour++
    ) {

        const angle =
            ((hour % 12) * 30) -
            90;


        createClockNumber(
            clock,
            hour,
            hour.toString(),
            angle
        );

    }

}


// ========================================
// MINUTE CLOCK
// ========================================

function renderMinuteClock(clock) {

    for (
        let minute = 0;
        minute < 60;
        minute += 5
    ) {

        const angle =
            (minute * 6) -
            90;


        createClockNumber(
            clock,
            minute,
            minute
                .toString()
                .padStart(2, "0"),
            angle
        );

    }

}


// ========================================
// CREATE CLOCK NUMBER
// ========================================

function createClockNumber(
    clock,
    value,
    text,
    angle
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";

    button.className =
        "clock-number";

    button.textContent =
        text;


    const radius =
        38.5;


    const x =
        50 +
        Math.cos(
            angle * Math.PI / 180
        ) *
        radius;


    const y =
        50 +
        Math.sin(
            angle * Math.PI / 180
        ) *
        radius;


    button.style.left =
        `${x}%`;


    button.style.top =
        `${y}%`;


    if (
        clockMode === "hour" &&
        selectedHour === value
    ) {

        button.classList.add(
            "selected"
        );

    }


    if (
        clockMode === "minute" &&
        selectedMinute === value
    ) {

        button.classList.add(
            "selected"
        );

    }


    button.addEventListener(
        "click",
        function() {

            if (
                clockMode === "hour"
            ) {

                selectedHour =
                    Number(value);


                setClockMode(
                    "minute"
                );


                updateClockDisplay();

                updateSelectedTime();

            }

            else {

                selectedMinute =
                    Number(value);


                updateClockDisplay();

                updateSelectedTime();


                setTimeout(() => {

                    setClockMode(
                        "hour"
                    );

                }, 180);

            }

        }
    );


    clock.appendChild(
        button
    );

}


// ========================================
// CLOCK HAND
// ========================================

function updateClockHand() {

    const hand =
        document.querySelector(
            ".clock-hand"
        );


    if (!hand) {
        return;
    }


    let degrees;


    if (
        clockMode === "hour"
    ) {

        degrees =
            selectedHour * 30;

    }

    else {

        degrees =
            selectedMinute * 6;

    }


    hand.style.transform =
        `translate(-50%, -100%) rotate(${degrees}deg)`;

}


// ========================================
// UPDATE DIGITAL CLOCK
// ========================================

function updateClockDisplay() {

    const hourElement =
        document.getElementById(
            "clockHour"
        );


    const minuteElement =
        document.getElementById(
            "clockMinute"
        );


    if (
        !hourElement ||
        !minuteElement
    ) {

        return;

    }


    hourElement.textContent =
        String(
            selectedHour
        ).padStart(
            2,
            "0"
        );


    minuteElement.textContent =
        String(
            selectedMinute
        ).padStart(
            2,
            "0"
        );


    const amButton =
        document.getElementById(
            "amButton"
        );


    const pmButton =
        document.getElementById(
            "pmButton"
        );


    if (amButton) {

        amButton.classList.toggle(
            "active",
            selectedAMPM === "AM"
        );

    }


    if (pmButton) {

        pmButton.classList.toggle(
            "active",
            selectedAMPM === "PM"
        );

    }

}


// ========================================
// GET FORMATTED TIME
// ========================================

function getFormattedTime() {

    return `${selectedHour}:${String(
        selectedMinute
    ).padStart(2, "0")} ${selectedAMPM}`;

}


// ========================================
// UPDATE SELECTED TIME
// ========================================

function updateSelectedTime() {

    selectedTime =
        getFormattedTime();


    const timeText =
        document.getElementById(
            "selectedTimeText"
        );


    if (timeText) {

        timeText.textContent =
            `Selected time: ${selectedTime}`;

    }


    const timeContinue =
        document.getElementById(
            "timeContinue"
        );


    if (timeContinue) {

        timeContinue.disabled =
            false;

    }

}


// ========================================
// SHOW CONFIRMATION
// ========================================

function showConfirmation() {

    if (!selectedTime) {
        return;
    }


    const dateInput =
        document.getElementById(
            "datePicker"
        );


    if (!dateInput) {
        return;
    }


    const selectedDate =
        dateInput.dataset.value;


    if (!selectedDate) {
        return;
    }


    document
        .getElementById(
            "summaryActivity"
        )
        .textContent =
        selectedActivity;


    document
        .getElementById(
            "summaryDate"
        )
        .textContent =
        formatReadableDate(
            isoToDate(
                selectedDate
            )
        );


    document
        .getElementById(
            "summaryTime"
        )
        .textContent =
        selectedTime;


    showScreen(
        "confirmationScreen"
    );

}


// ========================================
// CONFIRM DATE + SAVE TO SUPABASE
// ========================================

// ========================================
// CONFIRM DATE + SAVE TO SUPABASE
// ========================================

async function confirmDate() {

    if (isSubmitting) {
        return;
    }

    const dateInput =
        document.getElementById(
            "datePicker"
        );

    if (!dateInput) {
        return;
    }

    const selectedDate =
        dateInput.dataset.value;

    if (!selectedDate) {
        return;
    }

    if (!selectedActivity) {
        alert("Please choose a date type ❤️");
        return;
    }

    if (!selectedTime) {
        alert("Please choose a time ❤️");
        return;
    }

    isSubmitting = true;

    // Get the confirmation button.
    const confirmButton =
        document.querySelector(
            '#confirmationScreen .primary-btn'
        );

    const originalButtonText =
        confirmButton
            ? confirmButton.innerHTML
            : "";

    if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.innerHTML =
            "Saving our date... ❤️";
    }

    try {

        // Get the exact submission date and time.
        const submittedAt = new Date();

        // Create a beautiful readable message.
        const submissionMessage =
            "She chose this on " +
            submittedAt.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "Asia/Kathmandu"
                }
            ) +
            " at " +
            submittedAt.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kathmandu"
                }
            );

        const { error } =
            await supabaseClient
                .from("date_responses")
                .insert({
                    invite_code: INVITE_CODE,
                    activity: selectedActivity,
                    selected_date: selectedDate,
                    selected_time: selectedTime,

                    // Submission date/time
                    submitted_at: submittedAt.toISOString(),

                    // Beautiful message
                    submission_message: submissionMessage
                });

   if (error) {
    console.error("SUPABASE ERROR:", error);

    alert(
        "Supabase Error:\n\n" +
        "Code: " + (error.code || "unknown") + "\n" +
        "Message: " + (error.message || "unknown") + "\n" +
        "Details: " + (error.details || "none") + "\n" +
        "Hint: " + (error.hint || "none")
    );

    return;
}

        // Only show the success screen
        // after Supabase confirms the save.

        document
            .getElementById(
                "finalActivity"
            )
            .textContent =
            selectedActivity;

        document
            .getElementById(
                "finalDate"
            )
            .textContent =
            formatReadableDate(
                isoToDate(
                    selectedDate
                )
            );

        document
            .getElementById(
                "finalTime"
            )
            .textContent =
            selectedTime;

        showScreen(
            "successScreen"
        );

        createConfetti();

    } catch (error) {

        console.error(
            "Unexpected Supabase error:",
            error
        );

        alert(
            "Something went wrong while saving. Please try again ❤️"
        );

    } finally {

        isSubmitting = false;

        if (confirmButton) {

            confirmButton.disabled = false;

            confirmButton.innerHTML =
                originalButtonText;
        }

    }

}

// ========================================
// CONFETTI
// ========================================

function createConfetti() {

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


        piece.textContent =
            Math.random() > 0.5
                ? "♥"
                : "✦";


        piece.style.position =
            "fixed";


        piece.style.left =
            Math.random() * 100 +
            "vw";


        piece.style.top =
            "-20px";


        piece.style.fontSize =
            Math.random() * 12 +
            10 +
            "px";


        piece.style.color =
            "#ff6b81";


        piece.style.zIndex =
            "9999";


        piece.style.pointerEvents =
            "none";


        document.body.appendChild(
            piece
        );


        const duration =
            Math.random() * 2500 +
            2000;


        piece.animate(

            [
                {
                    transform:
                        "translateY(0) rotate(0deg)",

                    opacity: 1
                },

                {
                    transform:
                        `translateY(110vh) rotate(${Math.random() * 720}deg)`,

                    opacity: 0
                }

            ],

            {
                duration:
                    duration,

                easing:
                    "ease-out"
            }

        );


        setTimeout(() => {

            piece.remove();

        }, duration);

    }

}


// ========================================
// CALENDAR OVERLAY
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupFirstMeetDate();

        setupDateKeyboard();


        const overlay =
            document.getElementById(
                "calendarOverlay"
            );


        // Click outside closes calendar

        if (overlay) {

            overlay.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeCalendar();

                    }

                }
            );

        }


        // Escape closes calendar

        document.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Escape"
                ) {

                    closeCalendar();

                }

            }
        );


        // Initial clock

        updateClockDisplay();

        renderClock();


        // Relationship counter

        startRelationshipCounter();

    }
);
