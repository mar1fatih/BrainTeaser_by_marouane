$(document).ready(function () {
  const questionsUrl = 'https://opentdb.com/api.php?amount=5&category=';
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  $('#start-quiz').click(function () {
    let selectedCategory = $('#category').val();
    fetchQuestions(selectedCategory);
  });

  function fetchQuestions(category) {
    $.getJSON(questionsUrl + category, (data) => {
      questions = data.results;
      currentQuestionIndex = 0;
      showQuestion();
      $('#quiz-container').show();
      $('#start').hide();
    });
  }

  function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      congrats = `Quiz Completed!\nyou got ${score} points`
      $('#question-box').html(`<p>${congrats}</p>`);
      $('#answer-box').html('');
      $('#next-question').hide();
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

    $('.answer-btn').click(function () {
      $(this).css({
        "background-color": "#008CBA",
      });
      let selectedAnswer = $(this).text();
      if (selectedAnswer === question.correct_answer) {
        score += 10;
	setTimeout(function() {
	  showQuestion();
        }, 1000);
      }
      currentQuestionIndex++;
      setTimeout(function() {
        showQuestion();
      }, 1000);
    });
  }
});
