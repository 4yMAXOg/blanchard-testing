document.addEventListener("DOMContentLoaded", swiperInit);

function swiperInit() {
  const swiper = new Swiper('.hero__swiper', {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    effect: 'fade',

    // Turn on later
    // autoplay: {
    //   delay: 10000,
    // },

    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true,
    // },

    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },

    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },

    keyboard: {
      enabled: true,
    },
  });

  // Prevent default behavior of scrolling down when space is 
  // pressed on bullet button
  // let bullets = swiper.pagination.bullets;

  // for(let i = 0; i < bullets.length; i++) {
  //   bullets[i].addEventListener("keypress", swiperSliderKeyPress);
  // }
}

// Prevent default behavior of scrolling down when space is 
// pressed on bullet button
function swiperSliderKeyPress(event) {
  // Watch for spacebar
  if(event.keyCode == 32) {
    event.preventDefault();
  }
}
