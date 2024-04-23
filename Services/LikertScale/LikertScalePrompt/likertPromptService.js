let currentPromptIndex = 0;
let prompts = [];
let responses = [];
let dateID = '';
let examName= 'likertPrompt';

async function loadPrompts() {
    prompts = await window.api.getLikertPrompt();
    sessionStorage.setItem('amountOfLikertPrompts', prompts.length);
    if (currentPromptIndex >= prompts.length) {
        window.location.href = '../../Slider/SliderService.html'; // Temporary Until Modularity/Only for build 1.0
        sessionStorage.clear(); // Clear session storage for new exam
    }
    displayPrompt(currentPromptIndex); // Start by displaying the first question
}

function displayPrompt(index) {
    if (index < prompts.length) {
        let { name, content } = prompts[index]; // Destructure to get name and content
        name = name.replace('.txt', ''); // Remove the '.txt' extension from the file name
        document.getElementById('promptTitle').textContent = `Title: ${name}`;
        document.getElementById('promptText').textContent = content;
        document.getElementById('responseInput').value = ''; // Clear previous response
        
    } else {
        console.log('No more prompts.');
    }
}

function saveResponseAndNext() {
    const responseInput = document.getElementById('responseInput');
    responses.push({
        prompt: prompts[currentPromptIndex].name.replace('.txt', ''),
        response: responseInput.value
    });
    sessionStorage.setItem('examResponses', JSON.stringify(responses));

    currentPromptIndex++;
    sessionStorage.setItem('currentLikertPromptIndex', currentPromptIndex);
    currentPromptIndex = parseInt(sessionStorage.getItem('currentLikertPromptIndex')) || 0;
    
    if (currentPromptIndex >= prompts.length) {
        finishExam();
        window.location.href = '../likertScaleService.html'; // Redirect if needed
    } else {
        displayPrompt(currentPromptIndex);
        window.location.href = '../likertScaleService.html'; // Redirect if needed
    }
}


function finishExam() {
    console.log('Exam finished. Responses:', responses);
}

document.addEventListener('DOMContentLoaded', () => {
    currentPromptIndex = parseInt(sessionStorage.getItem('currentLikertPromptIndex')) || 0;
    loadPrompts();
    document.getElementById('nextPrompt').addEventListener('click', saveResponseAndNext);
});

