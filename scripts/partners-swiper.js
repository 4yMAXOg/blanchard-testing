document.addEventListener("DOMContentLoaded", swiperInit);

function swiperInit() {
  const swiper = new Swiper('.partners__swiper', {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    uniqueNavElements: true,
    touchStartPreventDefault: false,

    navigation: {
      nextEl: '.partners__button-next',
      prevEl: '.partners__button-prev',
    },

    keyboard: {
      enabled: true,
    },

    on: {
      init() {
        refreshPartnersSlides.call(this);
      }, 

      slideChangeTransitionEnd() {
        refreshPartnersSlides.call(this);
      }, 
    }, 


    slidesPerView: 1,
    spaceBetween: 20,

    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      }, 
      576: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      800: {
        slidesPerView: 2,
        spaceBetween: 50,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 50,
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

function refreshPartnersSlides() {
  let currentBreakpoint = this.currentBreakpoint;
  let breakpoints = this.params.breakpoints;
  let slidesPerView = breakpoints[currentBreakpoint].slidesPerView;
  let currentIndex = this.activeIndex;

  // Disable all slides
  let slides = document.querySelectorAll('.partners__slide');
  for(let i = 0; i < slides.length; i++) {
    slides[i].tabIndex = -1;
    slides[i].setAttribute("aria-hidden", "true");
  };

  // Enable all visible slides
  for(let i = 0; i < slidesPerView; i++) {
    slides[currentIndex + i].tabIndex = 0;
    slides[currentIndex + i].setAttribute("aria-hidden", "false");
  };
}
