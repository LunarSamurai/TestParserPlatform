let currentPromptIndex = 0;
let prompts = [];
let responses = [];

const myPath = window.nodePath.join('this', 'is', 'a', 'path');
console.log(myPath);


async function loadPrompts() {
    prompts = await window.api.getLikertPrompt();
    if (currentPromptIndex >= prompts.length) {
        window.location.href = '../likertScaleService.html';
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

function saveResponseAndNext() {
    const responseInput = document.getElementById('responseInput');
    responses.push({ prompt: prompts[currentPromptIndex], response: responseInput.value });
    sessionStorage.setItem('currentLikertPromptIndex', currentPromptIndex.toString());
    currentPromptIndex++;
    if (currentPromptIndex >= prompts.length) {
        window.location.href = '../likertScaleService.html';
    }
    displayPrompt(currentPromptIndex);
}



function finishExam() {
    console.log('Prompt is Finished');
    // Additional logic for finishing the exam
}

document.addEventListener('DOMContentLoaded', () => {
    
    currentPromptIndex = parseInt(sessionStorage.getItem('currentLikertPromptIndex')) || 0;
    loadPrompts();
    document.getElementById('nextPrompt').addEventListener('click', saveResponseAndNext);
    if (currentPromptIndex >= prompts.length) {
        // If there are no more questions, finish the exam and redirect
        finishExam();
    }
});
