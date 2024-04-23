document.addEventListener('DOMContentLoaded', () => {

    loadQuestions();
    document.getElementById('nextQuestion').addEventListener('click', saveResponseAndNext);
});

let currentQuestionIndex = 0;
let questions = [];
let responses = [];
let dateID = '';
let examName= 'openEndedQuestion';

async function loadQuestions() {
    dateID = await window.api.getDateID();  // Get the DateID when loading questions
    questions = await window.api.getQuestions(); // Correctly populate the global 'questions' array
    displayQuestion(currentQuestionIndex); // Start by displaying the first question
}


function displayQuestion(index) {
    if (index < questions.length) {
        const question = questions[index];
        const questionText = document.getElementById('questionText');
        const responseInput = document.getElementById('responseInput');
        
        questionText.textContent = question; // Assuming the questions array contains strings
        responseInput.value = ''; // Clear previous response
    } else {
        finishExam();
    }
}

function saveResponseAndNext() {
    const responseInput = document.getElementById('responseInput');
    responses.push({
        promptFileName: questions[currentQuestionIndex].fileName, // Assuming fileName is available in question object
        response: responseInput.value
    });
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        finishExam();
    }
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
    window.location.href = 'OpenEndedPrompts/openEndedPromptService.html';
}
