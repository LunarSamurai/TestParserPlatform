let currentPromptIndex = 0;
let prompts = [];

async function loadPrompts() {
    prompts = await window.api.getPrompt();
    sessionStorage.setItem('amountOfPrompts', prompts.length);
    if (currentPromptIndex >= prompts.length) {
        window.location.href = '../../LikertScale/LikertScalePrompt/likertPromptService.html';
        sessionStorage.clear(); // Clear session storage for new exam
    }
    displayPrompt(currentPromptIndex); // Start by displaying the first question
}

function displayPrompt(index) {
    if (index < prompts.length) {
        let { name, content } = prompts[index]; // Destructure to get name and content

        // Remove the '.txt' extension from the file name
        name = name.replace('.txt', '');

        // Set the file name as the title
        const titleElement = document.getElementById('promptTitle');
        if (titleElement) {
            titleElement.textContent = `Title: ${name}`;
        }

        // Display the prompt content
        const promptText = document.getElementById('promptText');
        promptText.textContent = content;

        // Clear previous response
        document.getElementById('responseInput').value = '';
    } else {
        finishExam(); // No more questions, finish exam
    }
}


function showQuestionsNext() {
    currentPromptIndex++;
    sessionStorage.setItem('currentPromptIndex', currentPromptIndex.toString());
    window.location.href = '../openEndedQuestionService.html';
    displayPrompt(currentPromptIndex);
    if (currentPromptIndex >= prompts.length) {
        // If there are no more questions, finish the exam and redirect
        finishExam();
    }
}


function finishExam() {
    console.log('Finished');
}

document.addEventListener('DOMContentLoaded', () => {
    
    currentPromptIndex = parseInt(sessionStorage.getItem('currentPromptIndex')) || 0;
    loadPrompts();
    document.getElementById('nextPrompt').addEventListener('click', showQuestionsNext);

});
