let responses = [];
let dateID = '';
let examName = 'likertScaleQuestion';

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    const form = document.getElementById('likertForm');
    form.addEventListener('submit', handleSubmit);
});

async function loadQuestions() {
    dateID = await window.api.getDateID();  // Assuming this returns a DateID correctly
    console.log(promptIndex,amountOfPrompts);
}

async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const likertResponses = {};

    for (const [name, value] of formData) {
        likertResponses[name] = value;
    }

    saveResponseAndNext(likertResponses); // Pass likertResponses to the function
}

function saveResponseAndNext(likertResponses) {
    // Retrieve and parse the stored open-ended responses
    const openEndedResponses = JSON.parse(sessionStorage.getItem('examResponses') || '[]');
    
    responses.push({
        openEndedResponse: openEndedResponses,
        likertResponse: likertResponses
    });
    
    finishExam();
}

async function finishExam() {
    console.log('Exam finished, saving responses:', responses);
    try {
        const result = await window.api.invoke('save-to-file', {
            filename: `responses-${dateID}.json`,
            dataArray: responses
        });
        console.log('Save result:', result.message);
        navigateToEndScreen();
    } catch (error) {
        console.error("Error sending form data via IPC:", error);
    }
}

function navigateToEndScreen() {
    let promptIndex = parseInt(sessionStorage.getItem('currentLikertPromptIndex'), 10);
    let amountOfPrompts = parseInt(sessionStorage.getItem('amountOfLikertPrompts'), 10);
    if (promptIndex == amountOfPrompts) {
        window.location.href = '../Slider/SliderService.html';
    } else {
        window.location.href = 'LikertScalePrompt/likertPromptService.html';
    }
}
