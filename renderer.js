const appPath = window.electronApi.getAppPath();
console.log('Application path:', appPath);

// Assuming electronApi and mainMenu are exposed correctly to the renderer process

document.addEventListener('DOMContentLoaded', () => {
    const appPath = window.electronApi.getAppPath();
    console.log('Application path:', appPath);

    const actions = {
        'lefter': 'view-results',
        'left': 'upload',
        'center': 'start-exam',
        'right': 'admin-login',
        'righter': 'options'
    };

    // Set up event listeners for action buttons
    Object.entries(actions).forEach(([className, action]) => {
        const element = document.querySelector(`.${className}`);
        if (element) {
            element.addEventListener('click', () => window.mainMenu.sendAction(action));
        }
    });

    // Set up the form and its submission handling
    const form = document.getElementById('demographicForm');
    form.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        const formString = JSON.stringify(formObject, null, 2);

        // Use IPC to send the form data to the main process
        window.electronApi.send('save-form-data', formString);
    }

    // Listen for the save result from the main process
    window.electronApi.receive('form-data-save-response', (status) => {
        if (status === 'success') {
            alert('Form data saved successfully!');
        } else {
            alert('An error occurred while saving the form data.');
        }
    });

    // Handle toggling of prior service fields based on radio button selection
    const priorServiceYes = document.getElementById('priorServiceYes');
    const priorServiceFields = document.getElementById('priorServiceFields');

    function togglePriorServiceFields() {
        priorServiceFields.style.display = priorServiceYes.checked ? 'block' : 'none';
    }

    // Add change event listener to the prior service radio button
    priorServiceYes.addEventListener('change', togglePriorServiceFields);

    // Call the function to set the initial state of the prior service fields
    togglePriorServiceFields();
});

