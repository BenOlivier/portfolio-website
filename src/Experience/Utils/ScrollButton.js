$(document).ready(function(){
    $("img").on('click', function(event) {
      if (this.hash !== "") {
        event.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
          scrollTop: 400//$(hash).offset().top
        }, 600, function(){
          window.location.hash = hash;
        });
      } 
    });
  });