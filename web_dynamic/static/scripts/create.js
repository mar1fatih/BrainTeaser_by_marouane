$(document).ready(function() {
  $('#create_form').on('submit', function(action) {
    action.preventDefault();

    const username = $("#username").val();
    const email = $("#email").val();
    const password = $("#password").val();

    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/users',
      contentType: "application/json",
      data: JSON.stringify({
	username: username,
	email: email,
	password: password,
      }),
      success: function(res) {
        $("#create_form").off("submit").submit();
      },
      error: function(xhr, status, error) {
        if (xhr.status === 400) {
          const errData = JSON.parse(xhr.responseText);
          $("#result").text(errData.error);
        } 
      }
    });
  });
  $('.main_header').click(function() {
            window.location.href = '/';
        });
});
