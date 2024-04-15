let currentQuestionIndex = 0;
let questions = [];
let responses = [];

const myPath = window.nodePath.join('this', 'is', 'a', 'path');
console.log(myPath);


async function loadQuestions() {

    questions = await window.api.getQuestions(); // Correctly populate the global 'questions' array
    displayQuestion(currentQuestionIndex); // Start by displaying the first question
}

function displayQuestion(index) {
    if (index < questions.length) {
        const questionText = document.getElementById('questionText');
        questionText.textContent = questions[index];
        document.getElementById('responseInput').value = ''; // Prepare for new response
    } else {
        finishExam(); // No more questions, finish exam
    }
}

function saveResponseAndNext() {
    const responseInput = document.getElementById('responseInput');
    responses.push({ question: questions[currentQuestionIndex], response: responseInput.value });
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex); // Show next question or finish exam
}

function finishExam() {
    console.log('Exam finished, responses:', responses);
    window.location.href = 'OpenEndedPrompts/openEndedPromptService.html';

    // Additional logic for finishing the exam
}

document.addEventListener('DOMContentLoaded', () => {

    loadQuestions();
    document.getElementById('nextQuestion').addEventListener('click', saveResponseAndNext);
});
