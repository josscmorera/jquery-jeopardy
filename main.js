function createConfettiParticle() {
    const particle = document.createElement('div');
    particle.classList.add('confetti-particle');

    const x = Math.random() * window.innerWidth;
    const y = 0;
    const rotation = Math.random() * 360;
    const speed = Math.random() * 1000 + 1000;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    particle.animate([{
            transform: `none`,
            opacity: 1
        },
        {
            offset: 0.8,
            transform: `translateY(100vh) rotate(${rotation}deg)`,
            opacity: 1
        },
        {
            transform: `translateY(100vh) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: speed,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });
    document.querySelector('.confetti-container').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, speed);
}

async function readJeopardyData() {
    let response = await fetch('jeopardy.json');
    let data = await response.json();
    return data;
}

function startJeopady(questions) {
    let score = 0;
    let blockAmounts = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    let container = document.querySelector('.container');
    let questionDisplay = document.querySelector('.question-display');
    let questionAnswered = false;
    let selectedValue = 0;

    blockAmounts.forEach((amount) => {
        let button = document.createElement('button');
        button.textContent = `$${amount}`;
        button.classList.add('block');
        button.setAttribute('data-value', amount);

        button.addEventListener('click', function() {
            let matchingQuestions = questions.filter((question) => question.value === `\$${amount}`);
            let randomQuestion = matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)];

            if (randomQuestion) {
                selectedAnswer = randomQuestion.answer;
                selectedValue = amount;

                questionDisplay.innerHTML = randomQuestion.question;

                let blockBtns = document.querySelectorAll('.block');
                blockBtns.forEach((btn) => btn.setAttribute('disabled', 'disabled'));

                this.style.backgroundColor = 'gray';
            }
        });

        container.appendChild(button);
    });

    let submitBtn = document.querySelector('.submit');
    let answerInput = document.querySelector('.answer');
    let blockBtns = document.querySelectorAll('.block');
    let scoreDisplay = document.querySelector('.score');

    submitBtn.addEventListener('click', () => {
        let userGuess = answerInput.value;
        if (!questionAnswered) {
            if (userGuess.toLowerCase() === selectedAnswer.toLowerCase()) {
                score += selectedValue;
                questionDisplay.textContent = "Congratulations!!! 🎉🎉🎉";

                for (let i = 0; i < 50; i++) {
                    setTimeout(createConfettiParticle, i * 20);
                }
            } else {
                questionDisplay.textContent = `Incorrect. The answer is: ${selectedAnswer}`;
            }

            questionAnswered = true;
        }

        blockBtns.forEach((btn) => {
            if (!btn.style.backgroundColor.includes('gray')) {
                btn.removeAttribute('disabled');
            }
        });
        scoreDisplay.textContent = score;
        answerInput.value = '';
    });

    blockBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            questionAnswered = false;
        });
    });
}

function fetchQuestionsAndStartGame() {
    readJeopardyData()
        .then((questions) => {
            startJeopady(questions);
        })
        .catch((error) => {
            console.error('Error fetching JSON data:', error);
        });
}

fetchQuestionsAndStartGame();