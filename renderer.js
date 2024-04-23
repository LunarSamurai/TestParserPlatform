document.addEventListener('DOMContentLoaded', () => {
    const appPath = window.electronApi.getAppPath();
    console.log('Application path:', appPath);

    setupActionButtons();
    setupPriorServiceFields();
    loadSliders();
    setupFormInteractions();
});

function setupActionButtons() {
    const actions = {
        'lefter': 'view-results',
        'left': 'upload',
        'center': 'start-exam',
        'right': 'admin-login',
        'righter': 'options'
    };

    Object.entries(actions).forEach(([className, action]) => {
        const element = document.querySelector(`.${className}`);
        if (element) {
            element.addEventListener('click', () => window.mainMenu.sendAction(action));
        }
    });
}

function setupPriorServiceFields() {
    const priorServiceYes = document.getElementById('priorServiceYes');
    const priorServiceFields = document.getElementById('priorServiceFields');

    function togglePriorServiceFields() {
        priorServiceFields.style.display = priorServiceYes.checked ? 'block' : 'none';
    }

    priorServiceYes.addEventListener('change', togglePriorServiceFields);
    togglePriorServiceFields();
}

function loadSliders() {
    window.electronAPI.loadSliders()
        .then(data => console.log(data)) // Use this data to populate sliders
        .catch(handleError);
}

function setupFormInteractions() {
    const formData = {}; // Ensure formData is defined properly
    const dateID = ''; // Ensure dateID is defined properly
    const responses = {}; // Ensure responses are defined properly

    window.api.saveFormData(formData)
        .then(response => console.log(response))
        .catch(handleError);

    window.api.saveResponses({ dateID, responses })
        .then(result => console.log(result))
        .catch(handleError);

    window.api.saveLikertResponses({ dateID, responses })
        .then(result => console.log(result))
        .catch(handleError);

    window.api.fetchOpenEndedResponses({ dateID, responses })
        .then(result => console.log(result))
        .catch(handleError);

    window.api.getOpenEndedResponses({ dateID, responses })
        .then(result => console.log(result))
        .catch(handleError);

    window.api.saveOpenEndedResponses({ dateID, responses })
        .then(result => console.log(result))
        .catch(handleError);

    window.api.saveCombinedResponses({ dateID, responses })
        .then(result => console.log(result))
        .catch(handleError);

    window.api.invoke('save-to-file', { test: 'Hello from Renderer' })
        .then(response => console.log('Test IPC response:', response))
        .catch(error => console.error('Test IPC error:', error));
    }

function handleError(error) {
    console.error("Error:", error);
}
