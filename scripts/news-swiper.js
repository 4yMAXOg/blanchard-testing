document.addEventListener("DOMContentLoaded", swiperInit);

function swiperInit() {
  const swiper = new Swiper('.news__swiper', {
    // Optional parameters
    direction: "horizontal",
    // loop: true,
    uniqueNavElements: true,
    // effect: 'fade',
    touchStartPreventDefault: false,

    pagination: {
      el: '.news__pagination',
      clickable: false,
      type: 'bullets',
    },

    navigation: {
      nextEl: '.news__button-next',
      prevEl: '.news__button-prev',
    },

//     scrollbar: {
//       el: '.swiper-scrollbar',
//     },

    keyboard: {
      enabled: true,
    },

    slidesPerView: 1,
    spaceBetween: 20,

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 34,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 27,
      },
      1500: {
        slidesPerView: 3,
        spaceBetween: 27,
      },
      1800: {
        slidesPerView: 3,
        spaceBetween: 50,
      }
    }

  });

  // Prevent default behavior of scrolling down when space is 
  // pressed on bullet button
  let bullets = swiper.pagination.bullets;

  for(let i = 0; i < bullets.length; i++) {
    bullets[i].addEventListener("keypress", swiperSliderKeyPress);
  }
}

// Prevent default behavior of scrolling down when space is 
// pressed on bullet button
function swiperSliderKeyPress(event) {
  // Watch for spacebar
  if(event.keyCode == 32) {
    event.preventDefault();
  }
}
