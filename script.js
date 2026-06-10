// --- Initial Predefined Events Data Array ---
let eventsArray = [
    {
        id: 1,
        name: "Web Dev Boot Camp",
        date: "2026-08-15",
        description: "An intensive hands-on session focusing on CSS Grid, Flexbox, and complex vanilla asynchronous JavaScript mechanics."
    },
    {
        id: 2,
        name: "Retro Gaming Night",
        date: "2026-02-10",
        description: "Looking back at the pixelated masterpieces of yesteryear. Local tournaments and dynamic arcade leaderboards."
    },
    {
        id: 3,
        name: "AI & Innovation Expo",
        date: "2026-11-04",
        description: "Explore tomorrow's tech landscape today. Guest keynotes highlighting generative automation frameworks and logic systems."
    }
];

// --- DOM Element Registrations ---
const container = document.getElementById('events-container');
const form = document.getElementById('event-form');
const inputName = document.getElementById('event-name');
const inputDate = document.getElementById('event-date');
const inputDesc = document.getElementById('event-desc');
const validationError = document.getElementById('validation-error');
const searchBar = document.getElementById('search-bar');

// --- Main App Logic Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
    renderApp(eventsArray);
});

// Logic coordinator function
function renderApp(dataPipeline) {
    const sortedData = sortEventsByDate(dataPipeline);
    buildCards(sortedData);
}

// --- Component Utilities ---

// 1. Array Sorter (Chronological - Oldest First)
function sortEventsByDate(arr) {
    return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
}

// 2. Evaluator checking if an event is older than current day calendar rules
function isPastEvent(eventDateString) {
    // Normalize dates to eliminate timezone hours inconsistencies during date-only evaluations
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const targetDate = new Date(eventDateString);
    targetDate.setHours(0,0,0,0);
    
    return targetDate < today;
}

// 3. Dynamic Card Factory Generation Engine
function buildCards(eventsList) {
    container.innerHTML = ''; // Clean canvas frame clear

    if(eventsList.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No matching events found.</p>`;
        return;
    }

    eventsList.forEach(event => {
        const pastCheck = isPastEvent(event.date);
        const cardClass = pastCheck ? 'event-card past' : 'event-card upcoming';
        
        const cardHTML = `
            <div class="${cardClass}" data-id="${event.id}">
                <div>
                    <h3>${escapeHTML(event.name)}</h3>
                    <div class="event-date">${formatDisplayDate(event.date)}</div>
                    <p class="event-desc">${escapeHTML(event.description)}</p>
                </div>
                <button class="delete-btn" onclick="deleteEventHandler(${event.id})">Delete Event</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// --- Event Handlers & Business Logic ---

// Form Submission & Validation Sequence
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Target Trimming Sanitize 
    const nameVal = inputName.value.trim();
    const dateVal = inputDate.value;
    const descVal = inputDesc.value.trim();

    // Comprehensive Requirement Validation
    if (!nameVal || !dateVal || !descVal) {
        validationError.textContent = "Error: All input configuration fields are explicitly required!";
        validationError.style.display = "block";
        return;
    }

    // Success clearing execution pathways
    validationError.textContent = "";
    validationError.style.display = "none";

    // Structural object generation
    const newEvent = {
        id: Date.now(), // Unique ID mapping generator
        name: nameVal,
        date: dateVal,
        description: descVal
    };

    eventsArray.push(newEvent);
    form.reset(); // Form state clearing
    
    // Clear search values to reveal insertion results seamlessly
    searchBar.value = '';
    renderApp(eventsArray);
});

// Node Deletion Routing Control Handler
function deleteEventHandler(id) {
    eventsArray = eventsArray.filter(item => item.id !== id);
    // Persist structural query tracking if user deleted a node during active filtering
    filterExecutionPipeline();
}

// Fast Typing Real-Time Search Filtering Evaluator 
searchBar.addEventListener('input', filterExecutionPipeline);

function filterExecutionPipeline() {
    const query = searchBar.value.toLowerCase().trim();
    
    const filteredResults = eventsArray.filter(event => {
        const matchesName = event.name.toLowerCase().includes(query);
        const matchesDate = event.date.includes(query); // Yields match tracking across substrings "YYYY-MM" etc.
        return matchesName || matchesDate;
    });

    renderApp(filteredResults);
}

// --- Micro-helper Utility Scripts ---
function formatDisplayDate(inputString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(inputString);
    // Offset local transformation corrections
    return new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000).toLocaleDateString(undefined, options);
}

// Simple XSS sanitization helper
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}