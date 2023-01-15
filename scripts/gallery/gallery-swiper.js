document.addEventListener("DOMContentLoaded", swiperInit);

function swiperInit() {
  const swiper = new Swiper('.gallery-slider__swiper', {
    // Optional parameters
    direction: "horizontal",
    loop: false,
    uniqueNavElements: true,
    // effect: 'fade',
    touchStartPreventDefault: false,
    // slideToClickedSlide: true, 
    focusableElements: "button", 

    // autoplay: {
    //   delay: 10000,
    // },

    pagination: {
      el: '.gallery-slider__pagination',
      clickable: false,
      type: 'fraction',
    },

    navigation: {
      nextEl: '.gallery-slider__button-next',
      prevEl: '.gallery-slider__button-prev',
    },

//     scrollbar: {
//       el: '.swiper-scrollbar',
//     },

    keyboard: {
      enabled: true,
    },

    a11y: {
      nextSlideMessage: "Следующий слайд", 
      prevSlideMessage: "Предыдущий слайд", 
    }, 

    on: {
      init() {
        refreshGallerySlides.call(this);
      }, 

      slideChangeTransitionEnd() {
        refreshGallerySlides.call(this);
      }, 
    }, 

    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,

    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
      }, 
      576: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 38,
      },
      800: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 34,
      },
      1200: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 25,
      },
      1500: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 25,
      },
      1800: {
        slidesPerView: 3,
        slidesPerGroup: 3,
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

function refreshGallerySlides() {
  let currentBreakpoint = this.currentBreakpoint;
  let breakpoints = this.params.breakpoints;
  let slidesPerGroup = breakpoints[currentBreakpoint].slidesPerGroup;
  let currentIndex = this.activeIndex;

  // Disable all slides
  let slides = document.querySelectorAll('.gallery-slider__slide');
  for(let i = 0; i < slides.length; i++) {
    slides[i].querySelector(".gallery-slider__slide-button").tabIndex = -1;
    slides[i].setAttribute("aria-hidden", "true");
  };

  // Enable all visible slides
  for(let i = 0; i < slidesPerGroup; i++) {
    slides[currentIndex + i].querySelector(".gallery-slider__slide-button").tabIndex = 0;
    slides[currentIndex + i].setAttribute("aria-hidden", "false");
  };
}

// function sliderMakeActiveInit() {
//   $(".gallery-slider__slide-button").mousedown((event) => {
//     event.currentTarget.classList.add("gallery-slider__slide-button_active");
//   });

//   $(".gallery-slider__slide-button").mouseup((event) => {
//     alert("mouseup");
//     event.currentTarget.classList.remove("gallery-slider__slide-button_active");
//   });
// }
