$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    var newDiv = $("<div>").append(
      $("<p>")
        .attr("data-id", data[i]._id)
        .text(data[i].title),
      $("<p>").text(data[i].summary),
      $("<p>").text(data[i].link),
      $("<br /><br />")
    );

    $("#articles").append(newDiv);
  }
});
