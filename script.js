document.addEventListener('DOMContentLoaded', function() {
    const problemElement = document.getElementById('problem');
    const answersElement = document.getElementById('answers');
    const scoreElement = document.getElementById('score-value');
    const resetButton = document.getElementById('reset-button');
    let score = 0;
    let isAnswered = false;
    let timer;
    let animationFrames = [];

    // Function to generate a new problem
    function generateProblem() {
        isAnswered = false;
        clearInterval(timer); // Clear previous timer
        cancelAnimationFrame(animationFrames); // Clear previous animation frames

        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const correctAnswer = num1 + num2;

        // Display the problem
        problemElement.textContent = `${num1} + ${num2} = ?`;

        // Clear previous answers
        answersElement.innerHTML = '';

        // Generate random answers including the correct one
        const answers = [];
        for (let i = 0; i < 4; i++) {
            let answer;
            if (i === 0) {
                answer = correctAnswer;
            } else {
                let incorrectAnswer;
                do {
                    incorrectAnswer = Math.floor(Math.random() * 40) + 1; // Ensure it's a random number not equal to correct answer
                } while (incorrectAnswer === correctAnswer || answers.includes(incorrectAnswer));
                answer = incorrectAnswer;
            }
            answers.push(answer);
        }

        // Shuffle answers array
        answers.sort(() => Math.random() - 0.5);

        // Display answers
        answers.forEach(answer => {
            const answerButton = document.createElement('div');
            answerButton.classList.add('answer');
            answerButton.textContent = answer;
            answerButton.addEventListener('click', function() {
                if (!isAnswered) {
                    isAnswered = true;
                    clearInterval(timer); // Stop the timer upon answering
                    cancelAnimationFrame(animationFrames); // Stop the animation frames

                    if (parseInt(answerButton.textContent) === correctAnswer) {
                        score++;
                        scoreElement.textContent = score;
                    } else {
                        endGame();
                    }

                    setTimeout(generateProblem, 1000); // Delay before generating new problem
                }
            });
            answersElement.appendChild(answerButton);

            // Move answers as bubbles (slower)
            moveBubble(answerButton);
        });

        // Start the timer for 20 seconds
        let timeLeft = 20;
        timer = setInterval(function() {
            timeLeft--;
            if (timeLeft >= 0) {
                problemElement.textContent = `${num1} + ${num2} = ? (${timeLeft} ثانية)`;
            } else {
                endGame();
            }
        }, 1000);
    }

    // Function to end the game
    function endGame() {
        clearInterval(timer);
        cancelAnimationFrame(animationFrames); // Stop the animation frames
        alert('لقد انتهت اللعبة!');

        score = 0;
        scoreElement.textContent = score;
        generateProblem();
    }

    // Function to move an answer as bubble
    function moveBubble(answerElement) {
        let x = Math.random() * (answersElement.clientWidth - answerElement.offsetWidth);
        let y = Math.random() * (answersElement.clientHeight - answerElement.offsetHeight);
        let xDirection = Math.random() < 0.5 ? -1 : 1;
        let yDirection = Math.random() < 0.5 ? -1 : 1;
        let speed = Math.random() * 1 + 0.5; // Slower speed between 0.5 and 1.5

        function move() {
            x += xDirection * speed;
            y += yDirection * speed;

            // Check boundaries
            if (x < 0 || x > answersElement.clientWidth - answerElement.offsetWidth) {
                xDirection *= -1;
            }
            if (y < 0 || y > answersElement.clientHeight - answerElement.offsetHeight) {
                yDirection *= -1;
            }

            answerElement.style.left = x + 'px';
            answerElement.style.top = y + 'px';

            animationFrames.push(requestAnimationFrame(move));
        }

        move();
    }

    // Reset button functionality
    resetButton.addEventListener('click', function() {
        if (!isAnswered) {
            clearInterval(timer);
            cancelAnimationFrame(animationFrames); // Stop the animation frames
            alert('يجب الانتهاء من الإجابة أولاً قبل الضغط على ريست.');
            return;
        }

        score = 0;
        scoreElement.textContent = score;
        generateProblem();
    });

    // Initial game start
    generateProblem();
});
