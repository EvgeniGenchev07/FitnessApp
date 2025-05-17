 // Tab functionality
 const tabBtns = document.querySelectorAll('.tab-btn');
 const tabContents = document.querySelectorAll('.tab-content');
 
 tabBtns.forEach(btn => {
     btn.addEventListener('click', () => {
         // Remove active class from all buttons and contents
         tabBtns.forEach(btn => btn.classList.remove('active'));
         tabContents.forEach(content => content.classList.remove('active'));
         
         // Add active class to clicked button and corresponding content
         btn.classList.add('active');
         const tabId = btn.getAttribute('data-tab');
         document.getElementById(tabId).classList.add('active');
     });
 });
 
 // Start button functionality (would link to actual workout pages)
 const startBtns = document.querySelectorAll('.start-btn');
 startBtns.forEach(btn => {
     btn.addEventListener('click', () => {
         const card = btn.closest('.workout-card');
         const workoutName = card.querySelector('.card-title').textContent;
         alert(`Starting ${workoutName} workout!`);
         // In a real app, this would navigate to the workout page
     });
 });
   // Function to switch tabs
function switchTab(tabId) {
 // Remove active class from all buttons and contents
 document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
 document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
 
 // Add active class to target button and content
 document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
 document.getElementById(tabId).classList.add('active');
}

// Check URL hash when page loads
window.addEventListener('DOMContentLoaded', () => {
 const hash = window.location.hash.substring(1); // Get hash without #
 
 if (hash === 'individual' || hash === 'group') {
     switchTab(hash);
 } else {
     // Default to individual if no valid hash
     switchTab('individual');
 }
});

// Update tab when hash changes (if user clicks browser back/forward)
window.addEventListener('hashchange', () => {
 const hash = window.location.hash.substring(1);
 if (hash === 'individual' || hash === 'group') {
     switchTab(hash);
 }
});

// Start button functionality
document.querySelectorAll('.start-btn').forEach(btn => {
 btn.addEventListener('click', () => {
     const card = btn.closest('.workout-card');
     const workoutName = card.querySelector('.card-title').textContent;
     alert(`Starting ${workoutName} workout!`);
 });
});
function backToMainPage()
{
     const language = navigator.language;
     if(language.startsWith("bg")){
        window.location.href="index.html";
     }
     else{
        window.location.href="index_en.html"
     }
}