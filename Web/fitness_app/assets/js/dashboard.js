const apiUrl = 'http://192.168.56.1:5000';
let allExercises = [];
let allFoods=[];
async function fetchFoods(){
    try {
        const response = await fetch(`${apiUrl}/food/all`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        allFoods = data; 
        console.log('Fetched foods:', allFoods);
    } catch (error) {
        console.error('Error fetching foods:', error);
    }
}
async function fetchExercises() {
    try {
        const response = await fetch(`${apiUrl}/exercise/all`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        allExercises = data; 
        console.log('Fetched exercises:', allExercises);
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}
fetchExercises();
fetchFoods();
// History Modal Functionality
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

historyPlanBtn.addEventListener('click', function() {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    historyDateInput.value = dateString;
    displayHistoryData(dateString);
    historyModal.style.display = 'block';
});

closeHistoryModal.addEventListener('click', function() {
    historyModal.style.display = 'none';
});

searchHistoryBtn.addEventListener('click', function() {
    const selectedDate = historyDateInput.value;
    displayHistoryData(selectedDate);
});

function displayHistoryData(date) {
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    historyDateDisplay.textContent = dateObj.toLocaleDateString('en-US', options);
    
    historyExercisesList.innerHTML = '';
    historyMealsList.innerHTML = '';
    
    if (historyData[date]) {
        historyData[date].exercises.forEach(exercise => {
            const li = document.createElement('li');
            li.textContent = exercise;
            historyExercisesList.appendChild(li);
        });
        
        historyData[date].meals.forEach(meal => {
            const li = document.createElement('li');
            li.textContent = meal;
            historyMealsList.appendChild(li);
        });
    } else {
        const noDataExercise = document.createElement('li');
        noDataExercise.textContent = "No data for this day";
        historyExercisesList.appendChild(noDataExercise);
        
        const noDataMeal = document.createElement('li');
        noDataMeal.textContent = "No data for this day";
        historyMealsList.appendChild(noDataMeal);
    }
}

window.addEventListener('click', function(e) {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// Page Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    
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
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            localStorage.setItem('currentPage', pageId);
        });
    });
    
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage && document.getElementById(storedPage)) {
        showPage(storedPage);
    } else {
        showPage('dashboard');
    }
    
    // Water Tracker
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
    
    // View More Modal
    document.querySelector('.view-more-card').addEventListener('click', function() {
        document.getElementById('view-more-modal').style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    });
    
    function closeModal() {
        document.getElementById('view-more-modal').style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }
    
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('view-more-modal')) {
            closeModal();
        }
    });
    
    // Exercise Search
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('exercise-search').value.trim().toLowerCase();
        const resultsContainer = document.querySelector('.search-results');
        resultsContainer.innerHTML = '';
        
        if (searchTerm === '') {
            resultsContainer.innerHTML = '<div class="result-placeholder"><p>Моля, въведете ключова дума за търсене</p></div>';
            return;
        }
        
        if (allExercises.length === 0) {
            resultsContainer.innerHTML = '<div class="result-placeholder"><p>Няма информация в базата данни</p></div>';
            return;
        }
        
        const filteredResults = allExercises.filter(exercise => 
            exercise.name.toLowerCase().includes(searchTerm) || 
            (exercise.description && exercise.description.toLowerCase().includes(searchTerm))
        );
        
        if (filteredResults.length === 0) {
            resultsContainer.innerHTML = '<div class="result-placeholder"><p>Няма намерени резултати</p></div>';
            return;
        }
        
        filteredResults.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <div class="result-info">
                    <h4>${result.name}</h4>
                    ${result.description ? `<p>${result.description}</p>` : ''}
                </div>
            `;
            resultsContainer.appendChild(item);
        });
    });
});

// Exercise Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const addExerciseButtons = document.querySelectorAll('.add-exercise-btn, #dashboard .plan-card .add-btn[data-type="exercise"]');
    const exerciseModal = document.getElementById('exercise-selection-modal');
    const closeExerciseModal = exerciseModal.querySelector('.close-modal');
    const cancelExerciseBtn = document.getElementById('cancel-exercise');
    const exerciseResultsContainer = document.getElementById('exercise-results');
    let currentDayCard = null; // To track which day card triggered the modal

    // Function to get the current day of the week (in lowercase to match data-day)
    function getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        const currentDay = days[today.getDay()];
        console.log('Current day:', currentDay); // Debug
        return currentDay;
    }

    function openExerciseModal(dayCard) {
        currentDayCard = dayCard; // Store the day card (null for Today's Plan)
        console.log('Opening modal for:', currentDayCard ? `Day: ${currentDayCard.getAttribute('data-day')}` : 'Today\'s Plan'); // Debug
        // Clear previous results
        exerciseResultsContainer.innerHTML = '<div class="result-placeholder"><p>Loading exercises...</p></div>';
        
        // Check if exercises are loaded
        if (allExercises.length === 0) {
            fetchExercises().then(() => populateExerciseModal());
        } else {
            populateExerciseModal();
        }
        
        exerciseModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function populateExerciseModal() {
        exerciseResultsContainer.innerHTML = '';
        
        if (allExercises.length === 0) {
            exerciseResultsContainer.innerHTML = '<div class="result-placeholder"><p>Няма налични упражнения</p></div>';
            return;
        }
        
        allExercises.forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'search-result-item';
            exerciseItem.innerHTML = `
                <div class="result-info">
                    <h4>${exercise.name}</h4>
                    ${exercise.description ? `<p>${exercise.description}</p>` : ''}
                </div>
                <button class="add-exercise-btn-modal">Добави</button>
            `;
            exerciseResultsContainer.appendChild(exerciseItem);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('#exercise-results .add-exercise-btn-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const exerciseItem = this.closest('.search-result-item');
                const exerciseName = exerciseItem.querySelector('h4').textContent;
                
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    this.textContent = 'Добави';
                    this.style.backgroundColor = '';
                } else {
                    this.classList.add('selected');
                    this.textContent = 'Добавено';
                    this.style.backgroundColor = '#00aa00';
                    console.log('Selected exercise:', exerciseName); // Debug
                }
            });
        });
    }
    
    function closeExerciseModalFunc() {
        exerciseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentDayCard = null; // Reset the current day card
        console.log('Modal closed'); // Debug
    }
    
    addExerciseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            let dayCard = this.closest('.day-card');
            let targetDay = null;
            // If the button is in Today's Plan, find the day card for the current day
            if (!dayCard && this.closest('.plan-card')) {
                const currentDay = getCurrentDay();
                dayCard = document.querySelector(`.day-card[data-day="${currentDay}"]`);
                targetDay = currentDay;
                console.log('Today\'s Plan button clicked, targeting day:', currentDay); 
            } else if (dayCard) {
                targetDay = dayCard.getAttribute('data-day');
                console.log('Day card button clicked, targeting day:', targetDay); 
            }
            openExerciseModal(dayCard);
        });
    });
    
    closeExerciseModal.addEventListener('click', closeExerciseModalFunc);
    cancelExerciseBtn.addEventListener('click', closeExerciseModalFunc);
    
    window.addEventListener('click', function(event) {
        if (event.target === exerciseModal) {
            closeExerciseModalFunc();
        }
    });
    
    // Exercise search in modal
    const exerciseSearch = document.getElementById('exercise-search');
    exerciseSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('#exercise-results .search-result-item');
        
        if (searchTerm === '') {
            items.forEach(item => item.style.display = 'flex');
            return;
        }
        
        items.forEach(item => {
            const exerciseName = item.querySelector('h4').textContent.toLowerCase();
            const exerciseDesc = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
            
            if (exerciseName.includes(searchTerm) || exerciseDesc.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    document.getElementById('confirm-exercise').addEventListener('click', function() {
        // Get all selected exercises
        const selectedExercises = [];
        document.querySelectorAll('#exercise-results .add-exercise-btn-modal.selected').forEach(btn => {
            const exerciseItem = btn.closest('.search-result-item');
            const exerciseName = exerciseItem.querySelector('h4').textContent;
            selectedExercises.push(exerciseName);
        });
        console.log('Confirmed exercises:', selectedExercises); // Debug
        
        // Add exercises to the corresponding day's exercise list
        if (selectedExercises.length > 0 && currentDayCard) {
            const day = currentDayCard.getAttribute('data-day');
            const exerciseList = document.getElementById(`${day}_exercise`);
            if (exerciseList) {
                selectedExercises.forEach(exercise => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${exercise}
                        <i class="fas fa-trash delete-exercise" style="color:red; cursor: pointer; float: right; font-size:17px"></i>
                    `;
                    exerciseList.appendChild(li);
                    // Add delete functionality
                    li.querySelector('.delete-exercise').addEventListener('click', function() {
                        // Remove from weekly plan
                        li.remove();
                        console.log(`Removed ${exercise} from ${day}_exercise`);
                        // If the selected day is today, also remove from Today's Plan
                        if (day === getCurrentDay()) {
                            const todayExerciseList = document.getElementById('today_plan_exercise');
                            if (todayExerciseList) {
                                const todayItems = todayExerciseList.querySelectorAll('li');
                                todayItems.forEach(item => {
                                    if (item.textContent.includes(exercise)) {
                                        item.remove();
                                        console.log(`Removed ${exercise} from today_plan_exercise`);
                                    }
                                });
                            }
                        }
                    });
                });
                console.log(`Added exercises to ${day}_exercise`); 
            } else {
                console.error(`Exercise list for ${day} not found`);
            }
        }
        
        // Add to Today's Plan only if the selected day is today
        const currentDay = getCurrentDay();
        const selectedDay = currentDayCard ? currentDayCard.getAttribute('data-day') : currentDay;
        console.log('Selected day:', selectedDay, 'Current day:', currentDay); // Debug
        if (selectedDay === currentDay && selectedExercises.length > 0) {
            const todayExerciseList = document.getElementById('today_plan_exercise');
            if (todayExerciseList) {
                selectedExercises.forEach(exercise => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${exercise}
                       <i class="fas fa-trash delete-exercise" style="color:red; cursor: pointer; float: right;"></i>
                    `;
                    todayExerciseList.appendChild(li);
                    // Add delete functionality
                    li.querySelector('.delete-exercise').addEventListener('click', function() {
                        // Remove from Today's Plan
                        li.remove();
                        console.log(`Removed ${exercise} from today_plan_exercise`);
                        // Also remove from the weekly plan for the current day
                        const weeklyExerciseList = document.getElementById(`${currentDay}_exercise`);
                        if (weeklyExerciseList) {
                            const weeklyItems = weeklyExerciseList.querySelectorAll('li');
                            weeklyItems.forEach(item => {
                                if (item.textContent.includes(exercise)) {
                                    item.remove();
                                    console.log(`Removed ${exercise} from ${currentDay}_exercise`);
                                }
                            });
                        }
                    });
                });
                console.log('Added exercises to today_plan_exercise'); 
            } else {
                console.error('Today\'s Plan exercise list (today_plan_exercise) not found');
            }
        } else {
            console.log('Not adding to today_plan_exercise: selected day is not today'); 
        }
        
        closeExerciseModalFunc();
    });
});
// Meal Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    const addMealButtons = document.querySelectorAll('.add-meal-btn, #dashboard .plan-card .add-btn[data-type="meal"]');
    const mealModal = document.getElementById('meal-selection-modal');
    const closeMealModal = mealModal.querySelector('.close-modal');
    const cancelMealBtn = document.getElementById('cancel-meal');
    const mealResultsContainer = document.getElementById('meal-results');
    let currentDayCard = null; // To track which day card triggered the modal

    // Function to get current day of week
    function getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        return days[today.getDay()];
    }

    function openMealModal(dayCard) {
        currentDayCard = dayCard;
        console.log('Opening meal modal for:', currentDayCard ? currentDayCard.getAttribute('data-day') : 'Today');
        
        // Clear previous results
        mealResultsContainer.innerHTML = '<div class="result-placeholder"><p>Зареждане на храни...</p></div>';
        
        // Check if foods are loaded
        if (allFoods.length === 0) {
            fetchFoods().then(() => populateMealModal());
        } else {
            populateMealModal();
        }
        
        mealModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function populateMealModal() {
        mealResultsContainer.innerHTML = '';
        
        if (allFoods.length === 0) {
            mealResultsContainer.innerHTML = '<div class="result-placeholder"><p>Няма налични храни</p></div>';
            return;
        }
        
        allFoods.forEach(food => {
            const mealItem = document.createElement('div');
            mealItem.className = 'search-result-item';
            mealItem.innerHTML = `
                <div class="result-info">
                    <h4>${food.name}</h4>
                    ${food.description ? `<p>${food.description}</p>` : ''}
                    <p>Калории: ${food.calories || 'N/A'} | Протеин: ${food.protein || 'N/A'}g | Въглехидрати: ${food.carbs || 'N/A'}g | Мазнини: ${food.fats || 'N/A'}g</p>
                </div>
                <button class="add-meal-btn-modal">Добави</button>
            `;
            mealResultsContainer.appendChild(mealItem);
            
            // Add event listener to the button
            mealItem.querySelector('.add-meal-btn-modal').addEventListener('click', function() {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    this.textContent = 'Добави';
                    this.style.backgroundColor = '';
                } else {
                    this.classList.add('selected');
                    this.textContent = 'Добавено';
                    this.style.backgroundColor = '#00aa00';
                }
            });
        });
    }
    
    function closeMealModalFunc() {
        mealModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentDayCard = null;
    }
    
    // Event listeners for all add meal buttons
    addMealButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            let dayCard = this.closest('.day-card');
            let targetDay = null;
            
            // If button is in Today's Plan, find the current day's card
            if (!dayCard && this.closest('.plan-card')) {
                const currentDay = getCurrentDay();
                dayCard = document.querySelector(`.day-card[data-day="${currentDay}"]`);
                targetDay = currentDay;
            } else if (dayCard) {
                targetDay = dayCard.getAttribute('data-day');
            }
            
            openMealModal(dayCard);
        });
    });
    
    closeMealModal.addEventListener('click', closeMealModalFunc);
    cancelMealBtn.addEventListener('click', closeMealModalFunc);
    
    window.addEventListener('click', function(event) {
        if (event.target === mealModal) {
            closeMealModalFunc();
        }
    });
    
    // Meal search in modal
    const mealSearch = document.getElementById('meal-search');
    mealSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('#meal-results .search-result-item');
        
        items.forEach(item => {
            const mealName = item.querySelector('h4').textContent.toLowerCase();
            const mealDesc = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (mealName.includes(searchTerm) || mealDesc.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Confirm meal selection
    document.getElementById('confirm-meal').addEventListener('click', function() {
        const selectedMeals = [];
        document.querySelectorAll('#meal-results .add-meal-btn-modal.selected').forEach(btn => {
            const mealItem = btn.closest('.search-result-item');
            const mealName = mealItem.querySelector('h4').textContent;
            const mealDetails = mealItem.querySelectorAll('p');
            const mealInfo = mealDetails[1]?.textContent || '';
            const calories = mealDetails[0]?.textContent.match(/Калории:\s*(\d+)/i)[1] || 0;
            selectedMeals.push({name: mealName, info: mealInfo, calories});
        });
        
        console.log('Confirmed meals:', selectedMeals);
        
        // Add meals to the corresponding day's meal list
        if (selectedMeals.length > 0 && currentDayCard) {
            const day = currentDayCard.getAttribute('data-day');
            const mealList = document.getElementById(`${day}_food`);
            if (mealList) {
                selectedMeals.forEach(meal => {
                    const li = document.createElement('li');
                    li.setAttribute('data-calories', meal.calories);
                    li.innerHTML = `
                        ${meal.name} (${meal.info})
                        <i class="fas fa-trash delete-meal" style="color:red; cursor: pointer; float: right;"></i>
                    `;
                    mealList.appendChild(li);
                    
                    // Add delete functionality
                    li.querySelector('.delete-meal').addEventListener('click', function() {
                        li.remove();
                        // Also remove from Today's Plan if current day
                        if (day === getCurrentDay()) {
                            const todayMealList = document.getElementById('today_plan_food');
                            const todayItems = todayMealList.querySelectorAll('li');
                            todayItems.forEach(item => {
                                if (item.textContent.includes(meal.name)) {
                                    item.remove();
                                }
                            });
                        }
                        updateCaloriesDisplay();
                    });
                });
            }
        }
        
        // Add to Today's Plan if the selected day is today
        const currentDay = getCurrentDay();
        const selectedDay = currentDayCard ? currentDayCard.getAttribute('data-day') : currentDay;
        
        if (selectedDay === currentDay && selectedMeals.length > 0) {
            const todayMealList = document.getElementById('today_plan_food');
            if (todayMealList) {
                selectedMeals.forEach(meal => {
                    const li = document.createElement('li');
                    li.setAttribute('data-calories', meal.calories);
                    li.innerHTML = `
                        ${meal.name} (${meal.info})
                        <i class="fas fa-trash delete-meal" style="color:red; cursor: pointer; float: right;"></i>
                    `;
                    todayMealList.appendChild(li);
                    
                    // Add delete functionality
                    li.querySelector('.delete-meal').addEventListener('click', function() {
                        li.remove();
                        // Also remove from weekly plan
                        const weeklyMealList = document.getElementById(`${currentDay}_food`);
                        if (weeklyMealList) {
                            const weeklyItems = weeklyMealList.querySelectorAll('li');
                            weeklyItems.forEach(item => {
                                if (item.textContent.includes(meal.name)) {
                                    item.remove();
                                }
                            });
                        }
                        updateCaloriesDisplay();
                    });
                });
            }
        }
        
        closeMealModalFunc();
        updateCaloriesDisplay();
    });

    function updateCaloriesDisplay() {
        const meals = document.querySelectorAll('#today_plan_food li');
        let totalCalories = 0;
        
        meals.forEach(meal => {
            const calories = meal.dataset.calories;
            if (calories) {
                totalCalories += parseInt(calories);
            }
        });
        
        const displayElement = document.querySelector('.calories-display');
        if (displayElement) {
            displayElement.textContent = totalCalories;
        }
    }
    updateCaloriesDisplay();
});

// Navigation function
function getLanguageFromUrl() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('_bg.html')) {
        return 'bg';
    }
    return 'en';
}

function openAddExercise() {
    const language = getLanguageFromUrl();
    window.location.href = language === 'bg' ? 'add_exercise_bg.html' : 'add_exercise.html';
}

//Exercise today plan
function openExerciseModal() {
    const modal = document.getElementById('exercise-selection-modal');
    modal.style.display = 'block';
    selectedExercises = [];
    populateExerciseResults(allExercises);
    
    const searchInput = document.getElementById('exercise-search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredExercises = allExercises.filter(exercise => 
            exercise.name.toLowerCase().includes(searchTerm)
        );
        populateExerciseResults(filteredExercises);
    });
}

function populateExerciseResults(exercises) {
    const resultsContainer = document.getElementById('exercise-results');
    resultsContainer.innerHTML = '';
    
    if (exercises.length === 0) {
        resultsContainer.innerHTML = '<p>Няма намерени упражнения</p>';
        return;
    }
    
    exercises.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'search-result-item';
        
        const isSelected = selectedExercises.some(ex => ex.id === exercise.id);
        
        exerciseItem.innerHTML = `
            <img src="${exercise.imageUrl || 'https://media.giphy.com/media/l0HU7JI1u2J9wYe2A/giphy.gif'}" alt="${exercise.name}">
            <div class="result-info">
                <h4>${exercise.name}</h4>
                <p>${exercise.category || 'Сила'} • ${exercise.difficulty || 'Начинаещ'}</p>
                <p>${exercise.sets || '3'}x${exercise.reps || '10'} повторения</p>
            </div>
            <button class="btn ${isSelected ? 'btn-selected' : 'btn-primary'} select-exercise-btn" 
                    data-exercise-id="${exercise.id}">
                ${isSelected ? 'Избрано ✓' : 'Избери'}
            </button>
        `;
        resultsContainer.appendChild(exerciseItem);
        
        exerciseItem.querySelector('.select-exercise-btn').addEventListener('click', function() {
            toggleExerciseSelection(exercise);
            this.textContent = selectedExercises.some(ex => ex.id === exercise.id) ? 'Избрано ✓' : 'Избери';
            this.className = `btn ${selectedExercises.some(ex => ex.id === exercise.id) ? 'btn-selected' : 'btn-primary'} select-exercise-btn`;
        });
    });
}

function toggleExerciseSelection(exercise) {
    const index = selectedExercises.findIndex(ex => ex.id === exercise.id);
    if (index === -1) {
        selectedExercises.push(exercise);
    } else {
        selectedExercises.splice(index, 1);
    }
}

function addSelectedExercisesToPlans() {
    selectedExercises.forEach(exercise => {
        addExerciseToTodayPlan(exercise);
        addExerciseToWeeklyPlan(exercise);
    });
    selectedExercises = [];
}

function addExerciseToTodayPlan(exercise) {
    const todayPlanList = document.getElementById('today_plan_exercise');
    const exerciseItem = document.createElement('li');
    exerciseItem.className = 'plan-item';
    exerciseItem.dataset.exerciseId = exercise.id;
    exerciseItem.innerHTML = `
        <span class="item-name">${exercise.name}</span>
        <span class="item-details">${exercise.sets || '3'}x${exercise.reps || '10'}</span>
        <button class="item-delete-btn btn-delete"><i class="fas fa-trash delete-exercise" style="color:red; cursor: pointer; float: right;"></i></button>
    `;
    todayPlanList.appendChild(exerciseItem);
    exerciseItem.querySelector('.item-delete-btn').addEventListener('click', function() {
        removeExerciseFromPlans(exercise.id);
    });
}

function addExerciseToWeeklyPlan(exercise) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const currentDay = days[today];
    
    const dayExerciseList = document.getElementById(`${currentDay}_exercise`);
    if (dayExerciseList) {
        const exerciseItem = document.createElement('li');
        exerciseItem.className = 'day-list-item';
        exerciseItem.dataset.exerciseId = exercise.id;
        exerciseItem.innerHTML = `
            <span>${exercise.name} (${exercise.sets || '3'}x${exercise.reps || '10'})</span>
            <button class="item-delete-btn btn-delete"><i class="fas fa-trash delete-exercise" style="color:red; cursor: pointer; float: right;"></i></button>
        `;
        dayExerciseList.appendChild(exerciseItem);
        
        exerciseItem.querySelector('.item-delete-btn').addEventListener('click', function() {
            removeExerciseFromPlans(exercise.id);
        });
    }
}

function removeExerciseFromPlans(exerciseId) {
    document.querySelectorAll(`.plan-item[data-exercise-id="${exerciseId}"]`).forEach(item => {
        item.remove();
    });
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    days.forEach(day => {
        const item = document.querySelector(`#${day}_exercise .day-list-item[data-exercise-id="${exerciseId}"]`);
        if (item) item.remove();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchExercises();
    document.querySelector('.today-plan .plan-card:first-child .add-btn').addEventListener('click', openExerciseModal);
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    window.addEventListener('click', function(event) {
        if (event.target.className === 'modal') {
            event.target.style.display = 'none';
        }
    });
    const searchBtn = document.createElement('button');
    searchBtn.id = 'search-exercise-btn';
    searchBtn.className = 'btn btn-primary';
    searchBtn.textContent = 'Търси';
    document.querySelector('#exercise-selection-modal .search-container').appendChild(searchBtn);
    
    searchBtn.addEventListener('click', function() {
        const searchInput = document.getElementById('exercise-search');
        const searchTerm = searchInput.value.toLowerCase();
        const filteredExercises = allExercises.filter(exercise => 
            exercise.name.toLowerCase().includes(searchTerm)
        );
        populateExerciseResults(filteredExercises);
    });
    
    document.getElementById('confirm-exercise').addEventListener('click', function() {
        addSelectedExercisesToPlans();
        document.getElementById('exercise-selection-modal').style.display = 'none';
    });
    
    document.getElementById('cancel-exercise').addEventListener('click', function() {
        selectedExercises = [];
        document.getElementById('exercise-selection-modal').style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.innerHTML = navMenu.classList.contains('open')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
});