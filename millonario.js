function shuffle(a) {
  for (let i = (a.length - 1); i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j],] = [a[j], a[i],];
  }
  return a;
}

// Siguiente pregunta
async function next({ currentQuestion, repeatedQuestions, }) {
  level = checkProgress(currentQuestion);
  const runProgramResponse = await runProgram({ level, repeatedQuestions, });
  setQuestion({ ...runProgramResponse, currentQuestion, });
}

// Si te equivocas, pinta la respuesta correcta
function checkWrightAnswer(correctAnswer) {
  const correct = document.getElementsByClassName('answer');
  for (let i = 0; i < correct.length; i++) {
    const answer = correct[i].innerText;
    if (answer === correctAnswer) {
      correct[i].setAttribute('class', 'check');
    }
  }
}

// Comprueba si la respuesta seleccionada es correcta
function checkAnswer(selectedAnswer, correctAnswer, id, currentQuestion, repeatedQuestions) {
  if (selectedAnswer === correctAnswer) {
    setTimeout(() => {
      document.getElementById('number' + currentQuestion).setAttribute('class', 'passed');
      question.removeChild(document.getElementById('questionDesc'));
      question.removeChild(document.getElementById('feedback'));
      for (let i = 0; i < 4; i++) {
        question.removeChild(document.getElementById('answer' + i));
      }
      currentQuestion++;
      next({ currentQuestion, repeatedQuestions, });
    }, 3000);

  } else {
    document.getElementById(id).setAttribute('class', 'wrong');
    checkWrightAnswer(correctAnswer);
    document.getElementById('number' + currentQuestion).setAttribute('class', 'notpassed');
  }
}

// Muestra los resultados
function visual() {
  // Titulo
  const root = document.getElementById('root');

  const header = document.createElement('header');
  root.appendChild(header);

  const img = document.createElement('img');
  img.src = './LOGO.jpeg';
  header.appendChild(img);

  // Botones
  const buttons = document.createElement('div');
  buttons.setAttribute('class', 'buttonBox');
  buttons.setAttribute('id', 'buttonBox');
  root.appendChild(buttons);

  // ProgressBar
  const progressBar = document.createElement('div');
  progressBar.setAttribute('class', 'progressBar');
  root.appendChild(progressBar);

  // Progreso
  for (let i = 0; i < 15; i++) {
    const progressBox = document.createElement('div');
    progressBox.setAttribute('id', 'number' + i);
    progressBox.setAttribute('class', 'box');

    progressBar.appendChild(progressBox);
  }

  // Main
  const main = document.createElement('main');
  root.appendChild(main);

  // Pregunta
  const question = document.createElement('div');
  question.setAttribute('id', 'question');
  question.setAttribute('class', 'question');
  main.appendChild(question);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// coge la pregunta
async function getQuestion(cat, level, repeatedQuestions) {
  const category = cat[getRandomInt(cat.length)];
  const response = await fetch(`https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`); // saca todos los paises
  const question = await response.json(); // transforma lo que ha sacado a json
  if (repeatedQuestions.includes(question._id)) {
    getQuestion(cat, level, repeatedQuestions);
  }
  repeatedQuestions.push(question._id);
  return { question, repeatedQuestions, };
}

// pregunta
async function runProgram({ level, repeatedQuestions, }) {
  try {
    const getQuestionResponse = await getQuestion(['javascript', 'html', 'css',], level, repeatedQuestions);
    // console.log(question);
    return getQuestionResponse;
  } catch (myError) {
    console.error('myError', myError.message); // el error que genera, me lo he copiado
  }
}


// Elige la dificultad
function checkProgress(currentQuestion) {
  let level = '';
  if (currentQuestion < 5) {
    level = 'easy';
  }
  if (5 <= currentQuestion) {
    level = 'medium';
  }
  if (10 <= currentQuestion) {
    level = 'hard';
  }
  document.getElementById('number' + currentQuestion).setAttribute('class', 'actual');
  return level;
}

// Elimina 2 respuestas
function removeTwo(questionCorrectAnswer) {
  let answersCounter = 0;
  let wrongAnswersCounter = 0;
  while (wrongAnswersCounter < 2) {
    const questions = document.getElementById('answer' + answersCounter);
    if (questions.innerText !== questionCorrectAnswer) {
      questions.setAttribute('class', 'wrong');
      console.log('error');
      wrongAnswersCounter++;
    }
    answersCounter++;
    console.log('prueba');
  }
}
// Display Div
function Display(ans) {
  const alert = document.createElement('div');
  alert.setAttribute('class', 'alert');
  alert.innerText(`Creo que la respuesta correcta es ${ans}`);
}


// LLamada del publico mi madre
function chooseQuestion(questionCorrectAnswer) {
  const ans0 = document.getElementById('answer0');
  let answ0 = -1;
  if (ans0.innerText === questionCorrectAnswer) {
    answ0 = 7;
  } else {
    answ0 = 1;
  }
  const ans1 = document.getElementById('answer1');
  let answ1 = answ0;
  if (ans1.innerText === questionCorrectAnswer) {
    answ1 = answ1 + 7;
  } else {
    answ1 = answ1 + 1;
  }
  const ans2 = document.getElementById('answer2');
  let answ2 = answ1;
  if (ans2.innerText === questionCorrectAnswer) {
    answ2 = answ2 + 7;
  } else {
    answ2 = answ2 + 1;
  }
  const ans3 = document.getElementById('answer3');
  let answ3 = answ2;
  if (ans3.innerText === questionCorrectAnswer) {
    answ3 = answ3 + 7;
  } else {
    answ3 = answ3 + 1;
  }
  const rand = getRandomInt(10);
  if (rand <= answ0) {
    ans0.style.color = 'blue';
  }
  if (answ0 < rand && rand <= answ1) {
    ans1.style.color = 'blue';
  }
  if (answ1 < rand && rand <= answ2) {
    ans2.style.color = 'blue';;
  } if (answ2 < rand && rand <= answ3) {
    ans3.style.color = 'blue';
  }
}

// comprueba por que pregunta vamos
function whichQuestion() {
  for (let i = 0; i < 15; i++) {
    const element = document.getElementById('number'+ i);
    if (element.className === 'actual') {
      return i;
    }
  }
}

// Comodines
function setButtons({ questionCorrectAnswer, currentQuestion, repeatedQuestions, }) {
  const buttonsB = document.getElementById('buttonBox');
  const questionShow = document.getElementById('question');
  // Pista
  if (buttonsB.innerHTML === '') {
    const hint = document.createElement('div');
    hint.setAttribute('class', 'buttons');
    hint.setAttribute('id', 'hint');
    hint.innerText = 'Pista';
    buttonsB.appendChild(hint);

    const callMum = document.createElement('div');
    callMum.setAttribute('class', 'buttons');
    callMum.setAttribute('id', 'callMum');
    callMum.innerText = 'Llamada';
    buttonsB.appendChild(callMum);

    const usePublic = document.createElement('div');
    usePublic.setAttribute('class', 'buttons');
    usePublic.setAttribute('id', 'usePublic');
    usePublic.innerText = 'Cambio';
    buttonsB.appendChild(usePublic);
  } else {
    const hint = document.getElementById('hint');
    const callMum = document.getElementById('callMum');
    const usePublic = document.getElementById('usePublic');
  }

  hint.addEventListener('click', () => {
    if (hint.classList.contains('buttons')) {
      hint.setAttribute('class', 'buttonClicked');
      removeTwo(questionCorrectAnswer);
    }
  });

  // Llamada
  callMum.addEventListener('click', () => {
    if (callMum.classList.contains('buttons')) {
      callMum.setAttribute('class', 'buttonClicked');
      chooseQuestion(questionCorrectAnswer);
    }
  });

  // Comodin publico
  usePublic.addEventListener('click', () => {
    if (usePublic.classList.contains('buttons')) {
      usePublic.setAttribute('class', 'buttonClicked');
      questionShow.removeChild(document.getElementById('questionDesc'));
      questionShow.removeChild(document.getElementById('feedback'));
      for (let i = 0; i < 4; i++) {
        questionShow.removeChild(document.getElementById('answer' + i));
      }
      const currentQuestion = whichQuestion();
      next({ currentQuestion, repeatedQuestions, });
    }
  });

}

// Pinta la pregunta
function setQuestion({ question, currentQuestion, repeatedQuestions, }) {
  const questionPaint = document.getElementById('question');
  const questionDesc = document.createElement('h2');
  questionDesc.setAttribute('id', 'questionDesc');
  questionDesc.innerText = question.description;
  questionPaint.appendChild(questionDesc);
  const questionFeedback = document.createElement('div');
  questionFeedback.setAttribute('id', 'feedback');
  questionPaint.appendChild(questionFeedback);

  const questions = Object.values(question.answers);
  const questionCorrectAnswer = question.answers[question.correctAnswer];
  console.log(questionCorrectAnswer);
  const questionsRandom = shuffle(questions);

  for (let i = 0; i < questionsRandom.length; i++) {
    const questionAnswer = document.createElement('div');
    questionAnswer.setAttribute('class', 'answer');
    questionAnswer.setAttribute('id', 'answer' + i);
    questionAnswer.innerText = questionsRandom[i];
    questionAnswer.addEventListener('click', function (e) {
      if (document.getElementsByClassName('check').length !== 0) {

      } else {
        deselect = document.querySelector('div.selected');

        if (deselect && deselect !== questionAnswer) {
          deselect.setAttribute('class', 'answer');
        }
        if (questionAnswer.classList.contains('selected')) {
          questionAnswer.setAttribute('class', 'check');
          const questionFeedback = document.getElementById('feedback');
          questionFeedback.innerText = question.feedback;
          checkAnswer(questionAnswer.innerText, questionCorrectAnswer, questionAnswer.id, currentQuestion, repeatedQuestions);
        }
        if (questionAnswer.classList.contains('answer')) {
          questionAnswer.setAttribute('class', 'selected');
        }
      }
    });
    questionPaint.appendChild(questionAnswer);
  }
  setButtons({ questionCorrectAnswer, currentQuestion, repeatedQuestions, });

}

// Main function
async function init() {
  visual();
  const currentQuestion = 0;
  const level = checkProgress(currentQuestion);
  const { question, repeatedQuestions, } = await runProgram({ level, repeatedQuestions: [], });
  setQuestion({ question, currentQuestion, repeatedQuestions, });
}

init();