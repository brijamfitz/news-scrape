$(document).on("click", "p", function() {
  $("#comments").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#comments").append("<h2>" + data.title + "</h2>");
    $("#comments").append("<input id='titleinput' name='title'>");
    $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#comments").append(
      "<button data-id='" +
        data._id +
        "' id='savecomment'>Save Comment</button>"
    );

    if (data.comment) {
      console.log(data.comment.title);
      console.log(data.comment.body);
      $("#titleinput").val(data.comment.title);
      $("#bodyinput").val(data.comment.body);
    }
  });
});

$(document).on("click", "#savecomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#comments").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// Scrape button event
$("#scrape").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(response) {
    location.reload();
  });
});