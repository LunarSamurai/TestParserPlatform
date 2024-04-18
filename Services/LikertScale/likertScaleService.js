document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('likertForm');
    form.addEventListener('submit', handleSubmit);
});

function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const responses = {};

    for (const [name, value] of formData) {
        responses[name] = value;
    }

    console.log('Survey responses:', responses);
    // Here you could send the data to a server or process it further
    window.location.href = 'LikertScalePrompt/likertPromptService.html';
}