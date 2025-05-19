const historyModal = document.getElementById('history-modal');
const historyPlanBtn = document.getElementById('history-plan-btn');
const closeHistoryModal = document.querySelector('.close-history-modal');
const searchHistoryBtn = document.getElementById('search-history');
const historyDateInput = document.getElementById('history-date');
const historyDateDisplay = document.getElementById('history-date-display');
const historyExercisesList = document.getElementById('history-exercises');
const historyMealsList = document.getElementById('history-meals');

const historyData = {
    '2023-05-19': {
        exercises: [
            "Deadlifts - 5x5",
            "Sledgehammer - 10x30s",
            "Battle Ropes"
        ],
        meals: [
            "Pre: Coffee + Banana",
            "Post: 2lb Steak",
            "Night: Casein"
        ]
    },
    '2023-05-18': {
        exercises: [
            "Squats - 5x5",
            "Pull-ups - Max"
        ],
        meals: [
            "Pre: Oatmeal + Eggs",
            "Post: Chicken + Rice"
        ]
    }
};

    // Open history modal
    historyPlanBtn.addEventListener('click', function() {
        // Set today's date as default
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        historyDateInput.value = dateString;
        
        // Display today's data by default
        displayHistoryData(dateString);
        
        historyModal.style.display = 'block';
    });

    // Close history modal
    closeHistoryModal.addEventListener('click', function() {
        historyModal.style.display = 'none';
    });

    // Search history
    searchHistoryBtn.addEventListener('click', function() {
        const selectedDate = historyDateInput.value;
        displayHistoryData(selectedDate);
    });

    // Display history data for a specific date
    function displayHistoryData(date) {
        const dateObj = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        historyDateDisplay.textContent = dateObj.toLocaleDateString('en-US', options);
        
        // Clear previous data
        historyExercisesList.innerHTML = '';
        historyMealsList.innerHTML = '';
        
        // Check if we have data for this date
        if (historyData[date]) {
            // Add exercises
            historyData[date].exercises.forEach(exercise => {
                const li = document.createElement('li');
                li.textContent = exercise;
                historyExercisesList.appendChild(li);
            });
            
            // Add meals
            historyData[date].meals.forEach(meal => {
                const li = document.createElement('li');
                li.textContent = meal;
                historyMealsList.appendChild(li);
            });
        } else {
            // No data for this date
            const noDataExercise = document.createElement('li');
            noDataExercise.textContent = "No data for this day";
            historyExercisesList.appendChild(noDataExercise);
            
            const noDataMeal = document.createElement('li');
            noDataMeal.textContent = "No data for this day";
            historyMealsList.appendChild(noDataMeal);
        }
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const pageContents = document.querySelectorAll('.page-content');
            
            // Function to show a specific page and hide others
            function showPage(pageId) {
                pageContents.forEach(c => {
                    if (c.id === pageId) {
                        c.classList.add('active');
                    } else {
                        c.classList.remove('active');
                    }
                });
                
                navLinks.forEach(l => {
                    if (l.getAttribute('data-page') === pageId) {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });
            }
            
            // Set click handlers for navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    showPage(pageId);
                    localStorage.setItem('currentPage', pageId);
                });
            });
            
            // Check for a stored page preference
            const storedPage = localStorage.getItem('currentPage');
            if (storedPage && document.getElementById(storedPage)) {
                showPage(storedPage);
            } else {
                showPage('dashboard');
            }
            
            // Water Tracker Functionality
            const waterDisplay = document.querySelector('.water-display');
            const add250ml = document.getElementById('add-250ml');
            const add500ml = document.getElementById('add-500ml');
            const resetWater = document.getElementById('reset-water');
            
            let waterAmount = 0;
            
            function updateWaterDisplay() {
                waterDisplay.textContent = (waterAmount / 1000).toFixed(1) + 'L';
            }
            
            add250ml.addEventListener('click', function() {
                waterAmount += 250;
                updateWaterDisplay();
            });
            
            add500ml.addEventListener('click', function() {
                waterAmount += 500;
                updateWaterDisplay();
            });
            
            resetWater.addEventListener('click', function() {
                waterAmount = 0;
                updateWaterDisplay();
            });
            
            // Modal functionality
            const exerciseModal = document.getElementById('exercise-modal');
            const addExerciseBtns = document.querySelectorAll('.add-btn');
            const closeModalBtns = document.querySelectorAll('.close-modal');
            
            addExerciseBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    exerciseModal.style.display = 'block';
                });
            });
            
            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    exerciseModal.style.display = 'none';
                });
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === exerciseModal) {
                    exerciseModal.style.display = 'none';
                }
            });
            
            // Exercise selection
            const selectionItems = document.querySelectorAll('.selection-item');
            selectionItems.forEach(item => {
                item.addEventListener('click', function() {
                    this.classList.toggle('selected');
                });
            });
        });