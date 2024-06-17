function handleHomeClick(){
    window.location.href = "../../index.html";
    sessionStorage.clear("isAdmin");
}

function triggerParticles(containerId) {
    particlesJS.load(containerId, 'particles.json', function() {
        console.log('Particles.js config loaded for ' + containerId);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const imageContainer = document.querySelector('.image-container');
    const textContainer = document.querySelector('.text-container');

    // Fade in the image
    setTimeout(() => {
        imageContainer.style.opacity = 1;
    }, 500);

    // Show the text after the image has fully faded in
    setTimeout(() => {
        textContainer.style.display = 'block';
        textContainer.style.opacity = 1;
    }, 2500); // Adjust this time to match the image fade-in duration

    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close-button");
    const modalText = document.getElementById("modal-text");
    const returnButton = document.querySelector(".return-button");
    const mainContent = document.getElementById("main-content");

    document.getElementById("home").addEventListener("click", () => {
        closeModal();
    });

    document.getElementById("manage").addEventListener("click", () => {
        showModal("Manage");
    });

    document.getElementById("arrange").addEventListener("click", () => {
        showModal("Arrange");
    });

    document.getElementById("create").addEventListener("click", () => {
        showModal("Create");
    });

    document.getElementById("support").addEventListener("click", () => {
        showModal("Support");
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
        mainContent.style.display = "block";
    });

    returnButton.addEventListener("click", () => {
        modal.style.display = "none";
        mainContent.style.display = "block";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            mainContent.style.display = "block";
        }
    });

    function showModal(text) {
        modalText.innerHTML = `<h2>${text}</h2><p>Content for ${text} goes here.</p>`;
        modal.style.display = "flex";
        mainContent.style.display = "none";
    }

    function closeModal() {
        modal.style.display = "none";
        mainContent.style.display = "block";
    }

    particlesJS.load('particles-js', 'particles.json', function() {
        console.log('Particles.js config loaded');
    });
});
