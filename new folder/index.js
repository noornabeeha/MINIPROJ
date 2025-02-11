function checkAnswer(choice) {
    const correctAnswer = 'A'; // Correct answer is 'A' (Paris)
    const feedback = document.getElementById("feedback1");
    const buttons = document.querySelectorAll(".answer-btn");

    // Reset button colors
    buttons.forEach(button => {
        button.classList.remove("correct", "incorrect");
    });

    if (choice === correctAnswer) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        document.querySelector(`button[onclick="checkAnswer('${choice}')"]`).classList.add("correct");
    } else {
        feedback.textContent = "Incorrect";
        feedback.style.color = "red";
        document.querySelector(`button[onclick="checkAnswer('${choice}')"]`).classList.add("incorrect");
    }
}

function checkFreeResponse() {
    const userInput = document.getElementById("userInput").value.trim().toLowerCase();
    const correctAnswer = "jupiter"; // Correct answer for the free response
    const feedback = document.getElementById("feedback2");

    // Reset input field color
    const inputField = document.getElementById("userInput");
    inputField.classList.remove("correct", "incorrect");

    if (userInput === correctAnswer) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        inputField.classList.add("correct");
    } else {
        feedback.textContent = "Incorrect";
        feedback.style.color = "red";
        inputField.classList.add("incorrect");
    }
}
