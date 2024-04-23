const slidersPerPage = 5;
let currentStart = 0;
let sliderData = [];
let responses = [];

async function loadSliders() {
    try {
        sliderData = await window.api.loadSliders();  // Fetch sliders using IPC exposed from preload script
        displaySliders();
    } catch (error) {
        console.error('Failed to load sliders:', error);
    }
}

function displaySliders() {
    const container = document.getElementById('sliderContainer');
    container.innerHTML = ''; // Clear previous content

    const endIndex = Math.min(currentStart + slidersPerPage, sliderData.length);
    sliderData.slice(currentStart, endIndex).forEach(slider => {
        const sliderDiv = document.createElement('div');
        sliderDiv.innerHTML = `<h4>${slider.content}</h4><input type="range" class="slider" min="0" max="100" value="50">`;
        container.appendChild(sliderDiv);
    });

    updateNextButton(endIndex);
}

function updateNextButton(endIndex) {
    const nextButton = document.getElementById('nextButton');
    const saveButton = document.getElementById('saveButton');
    
    if (endIndex < sliderData.length) {
        nextButton.style.display = 'block';
        saveButton.style.display = 'none';
    } else {
        nextButton.style.display = 'none';
        saveButton.style.display = 'block'; // Show save button when it's the last segment
    }
}

function saveCurrentSliderValues() {
    const sliders = document.querySelectorAll('.slider');
    const currentValues = Array.from(sliders).map(slider => parseInt(slider.value));

    // Temporary storage of current page slider values
    responses.push(currentValues);  // Assuming 'responses' is an array holding arrays of values
    sessionStorage.setItem('temporarySliderResponses', JSON.stringify(responses));
}

function handleNextClick() {
    saveCurrentSliderValues();  // Save current slider values

    currentStart += slidersPerPage;
    if (currentStart < sliderData.length) {
        displaySliders();
    } else {
        updateNextButton(sliderData.length); // This will hide "Next" and show "Save"
    }
}

function collectSliderValues() {
    const sliders = document.querySelectorAll('.slider');
    const sliderValues = Array.from(sliders).map((slider, index) => ({
        id: index, // or any other identifier
        value: slider.value
    }));
    return sliderValues;
}

async function saveAllSliderValues() {
    // Retrieve all stored values (or just use the 'responses' array if it holds all data)
    const allSliderValues = JSON.parse(sessionStorage.getItem('temporarySliderResponses')) || [];
    try {
        const result = await window.api.invoke('save-to-file', {
            filename: 'completeSliderResponses',
            dataArray: allSliderValues
        });
        console.log('All slider values saved:', result.message);
        window.location.href = "../../index.html";
        // Optionally navigate away or notify the user that the save was successful
    } catch (error) {
        console.error('Failed to send slider data via IPC:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    loadSliders();
    document.getElementById('nextButton').addEventListener('click', handleNextClick);
    document.getElementById('saveButton').addEventListener('click', saveAllSliderValues);
});

