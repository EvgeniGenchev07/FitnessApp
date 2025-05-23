const apiUrl = 'http://192.168.100.2:5000';

function getLanguageFromUrl() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('_bg.html')) {
        return 'bg';
    }
    return 'en'; // Default to English
}

const language = getLanguageFromUrl();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submitBtn');

    // Add pulse animation to all inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.animation = 'pulse 1.5s infinite';
        });
        
        input.addEventListener('blur', function() {
            this.style.animation = 'none';
        });
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Start UI feedback
        if (language === "bg") {
            submitBtn.textContent = 'ЗАПИСВАНе...';
        } else {
            submitBtn.textContent = 'Saving...';
        }
        submitBtn.style.animation = 'pulse 0.5s infinite';
        submitBtn.disabled = true;
        
        // Prepare form data
        const name = document.getElementById('exerciseName').value.trim();
        const estimatedTime = 10;
        const level = document.getElementById('difficulty').value;
        const photo = document.getElementById('exerciseImage').files[0];
        const reps = parseInt(document.getElementById('reps').value);
        const setsCount = parseInt(document.getElementById('sets').value);

        const sets = [];
        for (let i = 0; i < setsCount; i++) {
            sets.push({
                weight: 0,
                reps: reps,
                restTime: 60
            });
        }

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("EstimatedTime", estimatedTime);
        formData.append("Level", level);
        if (photo) {
            formData.append("Photo", photo);
            formData.append("PhotoMimeType", photo.type);
        }
        formData.append("Sets", JSON.stringify(sets));

        try {
            const response = await fetch(`${apiUrl}/exercise`, {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                
                // Success UI feedback
                if (language === "bg") {
                    submitBtn.textContent = 'УПРАЖНЕНИЕТО Е ЗАПИСАНО!';
                } else {
                    submitBtn.textContent = 'The exercise is saved!';
                }
                submitBtn.style.animation = 'none';
                submitBtn.style.backgroundColor = '#00aa00';
                
                setTimeout(() => {
                    if (language === "bg") {
                        submitBtn.textContent = 'ЗАПИШИ УПРАЖНЕНИЕТО';
                    } else {
                        submitBtn.textContent = 'Save the exercise';
                    }
                    submitBtn.style.backgroundColor = 'var(--blood-red)';
                    submitBtn.disabled = false;
                    form.reset();
                }, 2000);
                
            } else {
                const error = await response.json();
                throw new Error(error.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error:", err);
            
            // Error UI feedback
            if (language === "bg") {
                submitBtn.textContent = 'ГРЕШКА!';
                alert("Възникна грешка при заявката: " + err.message);
            } else {
                submitBtn.textContent = 'ERROR!';
                alert("An error occurred: " + err.message);
            }
            submitBtn.style.animation = 'none';
            submitBtn.style.backgroundColor = '#ff0000';
            
            setTimeout(() => {
                if (language === "bg") {
                    submitBtn.textContent = 'ЗАПИШИ УПРАЖНЕНИЕТО';
                } else {
                    submitBtn.textContent = 'Save the exercise';
                }
                submitBtn.style.backgroundColor = 'var(--blood-red)';
                submitBtn.disabled = false;
            }, 2000);
        }
    });
});