document.addEventListener('DOMContentLoaded', () => {
    const educationSelect = document.getElementById('education');
    const otherEducationInput = document.getElementById('otherEducation');
    const priorServiceYes = document.getElementById('priorServiceYes');
    const priorServiceNo = document.getElementById('priorServiceNo');
    const priorServiceFields = document.getElementById('priorServiceFields');

    educationSelect.addEventListener('change', (event) => {
        otherEducationInput.style.display = event.target.value === 'other' ? 'inline' : 'none';
    });

    function togglePriorServiceFields(display) {
        priorServiceFields.style.display = display ? 'block' : 'none';
    }

    priorServiceYes.addEventListener('change', () => {
        togglePriorServiceFields(priorServiceYes.checked);
    });

    priorServiceNo.addEventListener('change', () => {
        togglePriorServiceFields(priorServiceYes.checked);
    });

    // To check the state on load
    togglePriorServiceFields(priorServiceYes.checked);
});

function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('demographicForm');
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Handle checkbox group for commissioningSource differently to get all checked values
    const commissioningSources = [];
    document.querySelectorAll('input[name="commissioningSource"]:checked').forEach(checkbox => {
        commissioningSources.push(checkbox.value);
    });
    data.commissioningSource = commissioningSources;
    
    // If 'other' education is selected, add that value instead
    if (data.education === 'other') {
        data.education = formData.get('otherEducation');
    }
    
    console.log(data); // Here, handle the data object as needed, e.g., send it to a server

    // Redirect to test.html
    window.location.href = "../OpenEndedQuestions/OpenEndedPrompts/openEndedPromptService.html";
}

// Ensure the form submission is hooked up correctly
document.querySelector('#demographicForm').addEventListener('submit', handleSubmit);

document.addEventListener('DOMContentLoaded', function() {
    // This ensures the DOM is fully loaded before attaching event handlers.

    var checkbox = document.getElementById('priorServiceYes');
    var priorServiceFields = document.getElementById('priorServiceFields');

    checkbox.addEventListener('change', function() {
        // This toggles the display based on the checkbox state.
        priorServiceFields.style.display = checkbox.checked ? 'block' : 'none';
    });
});
