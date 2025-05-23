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

document.addEventListener('DOMContentLoaded', function() {
    
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
    
    
   document.getElementById('search-btn').addEventListener('click', function() {
    const searchTerm = document.getElementById('exercise-search').value.trim().toLowerCase();
    const resultsContainer = document.querySelector('.search-results');
    resultsContainer.innerHTML = '';
    
    if (searchTerm === '') {
        resultsContainer.innerHTML = '<div class="result-placeholder"><p>Моля, въведете ключова дума за търсене</p></div>';
        return;
    }
    
    const mockExercises = [
        { name: 'Лицеви опори', desc: 'Укрепване на горната част на тялото' },
        { name: 'Клякания', desc: 'Укрепване на краката и корема' },
        { name: 'Коремни преси', desc: 'Укрепване на коремните мускули' }
    ];
    
    const filteredResults = mockExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm) || 
        exercise.desc.toLowerCase().includes(searchTerm)
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
            </div>
        `;
        resultsContainer.appendChild(item);
    });
});
});

 //Navigation method
 function getLanguageFromUrl() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('_bg.html')) {
        return 'bg';
    }
    return 'en'; // Default to English
}
//Open the add_exercise
function openAddExercise()
{
    const language=getLanguageFromUrl();
    window.location.href= language === 'bg' ? 'add_exercise_bg.html' : 'add_exercise.html';
}



// Exercise Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all add exercise buttons
    const addExerciseButtons = document.querySelectorAll('.add-exercise-btn, .add-exercise-btn');
    
    // Get exercise modal elements
    const exerciseModal = document.getElementById('exercise-selection-modal');
    const closeExerciseModal = exerciseModal.querySelector('.close-modal');
    const cancelExerciseBtn = document.getElementById('cancel-exercise');
    
    // Get meal modal elements
    const mealModal = document.getElementById('meal-selection-modal');
    const closeMealModal = mealModal.querySelector('.close-modal');
    const cancelMealBtn = document.getElementById('cancel-meal');
    
    // Function to open exercise modal
    function openExerciseModal() {
        exerciseModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to close exercise modal
    function closeExerciseModalFunc() {
        exerciseModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    // Function to open meal modal
    function openMealModal() {
        mealModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to close meal modal
    function closeMealModalFunc() {
        mealModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    // Add event listeners to all add exercise buttons
    addExerciseButtons.forEach(btn => {
        btn.addEventListener('click', openExerciseModal);
    });
    
    // Add event listeners to all add meal buttons
    const addMealButtons = document.querySelectorAll('.add-meal-btn');
    addMealButtons.forEach(btn => {
        btn.addEventListener('click', openMealModal);
    });
    
    // Close modals when clicking X or cancel
    closeExerciseModal.addEventListener('click', closeExerciseModalFunc);
    cancelExerciseBtn.addEventListener('click', closeExerciseModalFunc);
    closeMealModal.addEventListener('click', closeMealModalFunc);
    cancelMealBtn.addEventListener('click', closeMealModalFunc);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === exerciseModal) {
            closeExerciseModalFunc();
        }
        if (event.target === mealModal) {
            closeMealModalFunc();
        }
    });
    
    // Search functionality for exercises
    const exerciseSearch = document.getElementById('exercise-search');
    exerciseSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('#exercise-results .search-result-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Search functionality for meals
    const mealSearch = document.getElementById('meal-search');
    mealSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('#meal-results .search-result-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Add exercise to plan
    const addExerciseButtonsInModal = document.querySelectorAll('#exercise-results .add-exercise-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (this.classList.contains('selected')) {
            // Отменя избора
            this.classList.remove('selected');
            this.textContent = 'Добави';
            this.style.backgroundColor = '';
        } else {
            // Добавя избора
            this.classList.add('selected');
            this.textContent = 'Добавено';
            this.style.backgroundColor = '#00aa00';
        }
    });
});

    // Add meal to plan
    const addMealButtonsInModal = document.querySelectorAll('#meal-results .add-meal-btn').forEach(btn => {
    btn.addEventListener('click', function () {
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

    
    // Confirm exercise selection
    document.getElementById('confirm-exercise').addEventListener('click', function() {
        // In a real app, you would process the selected exercises here
        closeExerciseModalFunc();
    });
    
    // Confirm meal selection
    document.getElementById('confirm-meal').addEventListener('click', function() {
        // In a real app, you would process the selected meals here
        closeMealModalFunc();
    });
});