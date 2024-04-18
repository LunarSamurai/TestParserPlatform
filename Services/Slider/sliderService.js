document.addEventListener('DOMContentLoaded', async () => {
    loadSliders();
});

const slidersPerPage = 5;
let currentStart = 0;
let sliderData = [];

async function loadSliders() {
    try {
        sliderData = await window.electronAPI.loadSliders();  // Fetch sliders using IPC exposed from preload script
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
        sliderDiv.innerHTML = `<h4>${slider.name}: ${slider.content}</h4><input type="range" min="0" max="100" value="50">`;
        container.appendChild(sliderDiv);
    });

    updateNextButton(endIndex);
}

function updateNextButton(endIndex) {
    const nextButton = document.getElementById('nextButton');
    if (endIndex < sliderData.length) {
        nextButton.style.display = 'block';
        nextButton.onclick = () => {
            currentStart += slidersPerPage;
            displaySliders();
        };
    } else {
        nextButton.style.display = 'none';
    }
}
