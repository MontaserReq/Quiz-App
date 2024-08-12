//Select Elements
let app = document.querySelector('.app');
let quizArea = document.querySelector(".quiz");
let ansArea = document.querySelector('#answer-buttons');
let nextBtn = document.querySelector('#next-btn');
let resultsCont = document.querySelector('.result');
let countD = document.querySelector(".countdown");

let currentIndex = 0;
let chosenAnswer = null; // متغير لتخزين الإجابة المختارة
let rightAnswers = 0;
let countInt;

function getQuestions() {
    let respons = new XMLHttpRequest();

    respons.onreadystatechange = function () {
        if (respons.status === 200 && respons.readyState === 4) {
            let data = JSON.parse(this.responseText);

            console.log(data)

            addQuestionData(data[currentIndex]);

            countDown(90, data.length);

            nextBtn.onclick = () => {
                //Get Right answer
                let rightAnswer = data[currentIndex].right_answer;
                
                //Check the answer
                checkAnswer(rightAnswer);

                currentIndex++;
                // أضف هذه السطر لتحديث السؤال بعد الضغط على زر "التالي"
                if (currentIndex < data.length) {
                    quizArea.innerHTML = "";
                    ansArea.innerHTML = "";
                    addQuestionData(data[currentIndex]);
                    chosenAnswer = null; // إعادة تعيين الإجابة المختارة
                }

                clearInterval(countInt);
                countDown(90, data.length);

                showResults(data.length);
            };
        }
    };
    respons.open("GET", 'question.json', true);
    respons.send();
}
getQuestions();

function addQuestionData(questionData) {
    //Create H2 Element
    let questoinTitle = document.createElement('h2');

    //Create question text
    let questionText = document.createTextNode(questionData.title);
    //Append h2 into title
    questoinTitle.appendChild(questionText);
    //Append title into quiz area
    quizArea.appendChild(questoinTitle);

    //Create the Answers
    for (let i = 1; i <= 4; i++) {
        //Create btn element
        let button = document.createElement('button');
        //Add class to buttons
        button.className = 'btn';
        //Add text node
        let btnText = document.createTextNode(questionData[`answer_${i}`]);
        //Append text node in btn 
        button.appendChild(btnText);
        //Append button into answers area
        ansArea.appendChild(button);

        // أضف معالج الحدث لكل زر
        button.onclick = () => {
            // إعادة تعيين الخلفية لجميع الأزرار
            let buttons = ansArea.querySelectorAll('.btn');
            buttons.forEach(btn => btn.style.backgroundColor = '');

            // تعيين خلفية جديدة للزر الذي تم النقر عليه
            button.style.backgroundColor = '#d3d3d3'; // اختر اللون الذي تريده

            chosenAnswer = questionData[`answer_${i}`];
        };
    }
}

function checkAnswer(rightAnswer) {
    // إذا كانت الإجابة المختارة صحيحة
    if (chosenAnswer === rightAnswer) {
        rightAnswers++;
    }
    console.log(rightAnswers)
}
function showResults(qCount) {
    let result;
    if (currentIndex === qCount) {
        quizArea.remove();
        ansArea.remove();
        nextBtn.remove();
        countD.remove();
        if (rightAnswers > (qCount / 2) && rightAnswers < qCount) {
            result = (`<span class="good">Your score is good </span>${rightAnswers} Form ${qCount}`);
        }
        else if (rightAnswers < (qCount / 2)) {
            result = (`<span class="bad">Your score is Bad </span>${rightAnswers} Form ${qCount}`);
        }
        if (rightAnswers === qCount) {
            result = (`<span class="perf">Your score is Perfect </span>${rightAnswers} Form ${qCount}`);
        }
        resultsCont.innerHTML = result;

    }
}

function countDown(duration, qCount) {
    if (currentIndex < qCount) {
        let minutes, secondes;
        countInt = setInterval(function () {
            minutes = parseInt(duration / 60);
            secondes = parseInt(duration % 60);

            minutes = minutes < 10 ? `0 ${minutes} ` : minutes;
            secondes = secondes < 10 ? `0 ${secondes} ` : secondes;

            countD.innerHTML = `${minutes} : ${secondes}`;
            if (--duration < 0) {
                clearInterval(countInt);
                nextBtn.click();

            }
        }, 1000);
    }
}