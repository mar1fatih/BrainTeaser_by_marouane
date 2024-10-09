$(document).ready(function () {
  function getCookie(name) {                                    //take cookie value from server request
    const cookies = document.cookie.split("; ");

    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }
  
  const result = async (url, header, body) => {                //send the token with the score to node server to save it
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
	...header
      },
      body: JSON.stringify(body)
    });
    return res.json()
  }

  const questionsUrl = 'https://opentdb.com/api.php?amount=10&category='; //url of the questions api
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  const cookie = getCookie('X-Token');

  $('#start-quiz').click(function () {                        //triger when clicking start quiz
    let selectedCategory = $('#category').val();
    fetchQuestions(selectedCategory);
  });

  function fetchQuestions(category) {
    $.getJSON(questionsUrl + category, (data) => {
      questions = data.results;
      currentQuestionIndex = 0;
      showQuestion(); // the function that shows the questions and hide the before questions
      $('#quiz-container').show();
      $('#start').hide();
    });
  }

  async function showQuestion() {
    if (currentQuestionIndex >= questions.length) { // if that determine if we reached the last question and send us the congrat msg
      congrats = `Quiz Completed!\nyou got ${score} points`
      const res = await result('/results', { 'X-Token': cookie }, { score });
      $('#question-box').html(`<p>${congrats}</p>`);
      $('#answer-box').html('');
      $('#answer-box').html(`<p class="yourpts">your highScore is ${res.highScore} Pts</p>
	      		     <button class="return">Retry</button>
	      		     <button class="logout">Logout</button>`);

      $('.logout').click(async function () {
        const cookie = getCookie('X-Token');	
        const res = await fetch('http://localhost:5000/disconnect', {
          method: 'GET',
          headers: { 'X-Token': cookie },
        });
	if (res.ok) {
          window.location.href = '/';
	}
      });

      $('.return').click(function() {
        location.reload();
      });

      return;
    }

    let question = questions[currentQuestionIndex];
    let answers = [...question.incorrect_answers, question.correct_answer];
    answers = answers.sort(() => Math.random() - 0.5);
    $('#question-box').html(question.question);

    let answerHtml = '';
    answers.forEach((answer, index) => {
      answerHtml += `<button class="answer-btn">${answer}</button><br>`;
    });
    $('#answer-box').html(answerHtml);
    $('#next-question').show();

    $('.answer-btn').click(async function () {
      let selectedAnswer = $(this).text();
      if (selectedAnswer === question.correct_answer) {
        score += 10;
	$(this).css({
          "background-color": "#008CBA",
        });
        $(".answer-btn").each(function() {
          $(this).removeClass("answer-btn").addClass("new-answer-btn");
        });
	currentQuestionIndex++;
	await setTimeout(async function() {
	  showQuestion();
        }, 1000);
      }else {
        $(this).css({
          "background-color": "#ff0000",
        });
	$(".answer-btn").each(function() {
          $(this).removeClass("answer-btn").addClass("new-answer-btn");
        });
        currentQuestionIndex++;
        await setTimeout(async function() {
	  showQuestion();
        }, 1000);
      }
    });
  }
});
