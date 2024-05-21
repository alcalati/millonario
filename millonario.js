function shuffle(a) {
  for (let i = (a.length - 1); i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j],] = [a[j], a[i],];
  }
  return a;
}
async function next({currentQuestion, repeatedQuestions,}) {
  level = checkProgress(currentQuestion);
  const runProgramResponse  = await runProgram({level, repeatedQuestions,});
  setQuestion({...runProgramResponse, currentQuestion,});
}


function checkWrightAnswer(correctAnswer) {
  const correct = document.getElementsByClassName('answer');
  for (let i = 0; i < correct.length; i++) {
    const answer = correct[i].innerText;
    if (answer === correctAnswer) {
      correct[i].setAttribute('class', 'check');
    }
  }
}

function checkAnswer(selectedAnswer, correctAnswer, id, currentQuestion, repeatedQuestions) {
  if (selectedAnswer === correctAnswer) {
    setTimeout(() => {
      document.getElementById('number' + currentQuestion).setAttribute('class', 'passed');
      question.removeChild(document.getElementById('questionDesc'));
      for (let i = 0; i < 4; i++) {
        question.removeChild(document.getElementById('answer' + i));
      }
      currentQuestion++;
      next({currentQuestion, repeatedQuestions,});
    }, 3000);

  } else {
    document.getElementById(id).setAttribute('class', 'wrong');
    checkWrightAnswer(correctAnswer);
    document.getElementById('number' + currentQuestion).setAttribute('class', 'notpassed');
  }
}

function visual() {
  // Titulo
  const root = document.getElementById('root');

  const header = document.createElement('header');
  root.appendChild(header);
  const title = document.createElement('h1');
  title.innerText = 'Quien quiere ser millonario';
  header.appendChild(title);


  // Botones
  const buttons = document.createElement('div');
  buttons.setAttribute('class', 'buttons');
  root.appendChild(buttons);
  // Pista
  const hint = document.createElement('button');
  hint.innerText = 'Pista';
  hint.addEventListener('click', () => {
  });
  buttons.appendChild(hint);
  // Comodin
  const callMum = document.createElement('button');
  callMum.innerText = 'Llamada';
  callMum.addEventListener('click', () => {
  });
  buttons.appendChild(callMum);
  // Comodin publico
  const usePublic = document.createElement('button');
  usePublic.innerText = 'Publico';
  usePublic.addEventListener('click', () => {
  });
  buttons.appendChild(usePublic);

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
  // const questionDesc = document.createElement('h2');
  // questionDesc.setAttribute('id', 'questionDesc');
  // question.appendChild(questionDesc);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getQuestion(cat, level, repeatedQuestions) {
  const category = cat[getRandomInt(cat.length)];
  const response = await fetch(`https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`); // saca todos los paises
  const question = await response.json(); // transforma lo que ha sacado a json
  console.log(repeatedQuestions);
  if (repeatedQuestions.includes(question._id)) {
    console.log('se ha repetido');
    getQuestion(cat, level, repeatedQuestions);
  }
  repeatedQuestions.push(question._id);
  return {question, repeatedQuestions,};
}

async function runProgram({level, repeatedQuestions,}) {
  try {
    const getQuestionResponse = await getQuestion(['javascript', 'html', 'css',], level, repeatedQuestions);
    // console.log(question);
    return getQuestionResponse;
  } catch (myError) {
    console.error('myError', myError.message); // el error que genera, me lo he copiado
  }
}



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

function setQuestion({question, currentQuestion, repeatedQuestions,}) {
  const questionPaint = document.getElementById('question');
  const questionDesc = document.createElement('h2');
  questionDesc.setAttribute('id', 'questionDesc');
  questionDesc.innerText = question.description;
  questionPaint.appendChild(questionDesc);

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
          checkAnswer(questionAnswer.innerText, questionCorrectAnswer, questionAnswer.id, currentQuestion, repeatedQuestions);
        }
        if (questionAnswer.classList.contains('answer')) {
          questionAnswer.setAttribute('class', 'selected');
        }
      }
    });
    questionPaint.appendChild(questionAnswer);
  }

}

async function init() {
  visual();
  const currentQuestion = 0;
  const level = checkProgress(currentQuestion);
  const {question, repeatedQuestions,} = await runProgram({level, repeatedQuestions:[],});

  setQuestion({question, currentQuestion, repeatedQuestions,});
}

init();