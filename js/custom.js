$(function () {
  // After loading mechanisms
  $('.loading-area').fadeOut(1000);

  // Menubar scroll effects
  const hasToggled = (function () {
    let visible = false;
    return function (scroll) {
      if ((scroll > 50 && !visible) || (scroll < 50 && visible)) {
        visible = !visible;
        return true;
      }

      return false;
    };
  })();

  $(document).scroll(function () {
    if (hasToggled($(document).scrollTop())) {
      $('header').toggleClass('scrolldown');
      $('.menu').toggleClass('scrolldown');
      $('.scrolltop').toggleClass('scrolldown');
    }
  });

  $('.samples-section-carousel').animate({
    left: '-' + $('#samples-section-item').css('width').slice(0, -2) * 4,
  });

  console.log();
});
