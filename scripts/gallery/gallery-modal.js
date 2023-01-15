var modalImagePath = "images/pictures/gallery-modal/";

var modalImageBreakpoints = [
    { breakpoint: 1200, resolution: "1920" }, 
    { breakpoint: 1023, resolution: "1024"}, 
    { breakpoint: 576, resolution: "768"}, 
    { breakpoint: 0, resolution: "320"}, 
];

var modalImageName = [
    "gallery-modal-1.jpg",
    "gallery-modal-2.jpg",
    "gallery-modal-3.jpg",
    "gallery-modal-4.jpg",
    "gallery-modal-5.jpg",
    "gallery-modal-6.jpg",
];

var modalArtist = [
    "Казимир Малевич",
    "Казимир Малевич",
    "Казимир Малевич",
    "Казимир Малевич",
    "Казимир Малевич",
    "Казимир Малевич",
];

var modalTitle = [
    "“Женщина с граблями”",
    "“Женщина с граблями”",
    "“Женщина с граблями”",
    "“Женщина с граблями”",
    "“Женщина с граблями”",
    "“Женщина с граблями”",
];

var modalDate = [
    "1931-1932",
    "1931-1932",
    "1931-1932",
    "1931-1932",
    "1931-1932",
    "1931-1932",
];

var modalDescription = [
    "Картина из второй серии крестьянского цикла работ Казимира Малевича. Художник принялся за её создание в 1930-1931 годах, после того, как первый цикл был утерян после Берлинской и Варшавской выставок в 1927 году. ",

    "Описание 2. Adipisicing quia iure ut eos enim, dicta. Quam perspiciatis quia veritatis quis rerum. In rem voluptas magni fuga sit mollitia? Sequi facere fuga dicta eos dicta Officia iure adipisci porro.",

    "Описание 3. Adipisicing quia iure ut eos enim, dicta. Quam perspiciatis quia veritatis quis rerum. In rem voluptas magni fuga sit mollitia? Sequi facere fuga dicta eos dicta Officia iure adipisci porro.",

    "Описание 4. Adipisicing quia iure ut eos enim, dicta. Quam perspiciatis quia veritatis quis rerum. In rem voluptas magni fuga sit mollitia? Sequi facere fuga dicta eos dicta Officia iure adipisci porro.",

    "Описание 5. Adipisicing quia iure ut eos enim, dicta. Quam perspiciatis quia veritatis quis rerum. In rem voluptas magni fuga sit mollitia? Sequi facere fuga dicta eos dicta Officia iure adipisci porro.",
    
    "Описание 6.  <div>Lorem veniam vitae blanditiis unde fugit Modi possimus omnis incidunt velit atque. Aliquam magnam dolore veritatis quos quasi nihil Deserunt iste consequuntur tempore vero veritatis! Officiis praesentium reiciendis ducimus similique?</div> <div>Elit quasi qui laudantium quidem consequuntur A numquam neque molestias unde eaque? Saepe debitis necessitatibus nostrum quibusdam expedita Sint maiores ducimus maxime sequi ad praesentium Necessitatibus quod voluptas dignissimos explicabo.</div> <div>Amet iste aliquam quae pariatur maiores, officia Iste numquam commodi cum ad cum Facilis illo quo delectus quos totam. Voluptatum illo debitis recusandae esse eveniet Maxime aliquam incidunt odit molestiae.</div> <div>Adipisicing ipsam porro vitae fuga expedita Cumque harum ea iure provident natus Sapiente voluptas quidem voluptates blanditiis nostrum Eaque reprehenderit eveniet fugit aut suscipit Nam labore tempore laudantium nihil magni!</div> <div>Lorem quos odio omnis vero blanditiis, rem eum? Minus repellat nam animi dicta natus totam, ratione. Et autem aspernatur possimus incidunt esse Eum ea saepe dolor quibusdam ab Exercitationem eligendi?</div> <div>Adipisicing iste praesentium sequi minus voluptatum magnam Deserunt vitae error unde excepturi inventore, voluptatum. Vitae nobis impedit aut officiis culpa suscipit earum necessitatibus? Soluta eligendi repudiandae maiores alias repellendus. Non!</div> <div>Amet harum iure reiciendis amet veritatis aut. Vel provident doloremque ipsa qui atque Possimus nemo beatae corrupti voluptas illum deserunt Hic tempore tempora amet id quam dolorum delectus? Unde libero.</div> <div>Sit eum ducimus quisquam obcaecati dolorem Natus nulla cupiditate vitae nam laboriosam ipsum! Sed autem excepturi molestias alias accusantium. Eveniet incidunt dolor maxime ab nihil nihil rerum cum. Suscipit quam.</div> <div>Lorem accusamus dolor natus nisi perspiciatis optio! Cumque doloribus officiis voluptate earum accusantium doloribus Odio iusto dicta a quidem illum, consequatur! Nulla optio delectus facilis incidunt quam. Assumenda doloribus magnam!</div> <div>Ipsum nobis nulla rem iure voluptates ullam! Sequi error soluta eligendi quas suscipit Tempore odio eaque quaerat alias saepe rerum Illo a veritatis veniam eum ex nobis. Beatae recusandae delectus?</div> lorem Adipisicing quia iure ut eos enim, dicta. Quam perspiciatis quia veritatis quis rerum. In rem voluptas magni fuga sit mollitia? Sequi facere fuga dicta eos dicta Officia iure adipisci porro.",
];


var galleryModal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'escape'],
    closeLabel: "Close",
    cssClass: [ "gallery-modal" ],
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
    }
});

var galleryFocusTrap;

$(".gallery-slider__slide-button").click(openGallerySlideModal);

function openGallerySlideModal(event) {
    let resolution = modalFindBreakpoint();
    let imageNumber = parseInt(event.currentTarget.dataset.number);

    let imagePath = modalImagePath + resolution + "/" + modalImageName[imageNumber];

    galleryModal.setContent(`
        <button class="gallery-modal__close transparent-button" aria-label="Закрыть модальное окно">
            <svg class="gallery-modal__close-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M0.666885 15.3045L15.3336 0.000275917L16.0002 0.695923L1.33355 16.0002L0.666885 15.3045Z" fill="black"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M0.666725 -2.96187e-06L15.3334 15.3042L14.6667 15.9999L5.76143e-05 0.695644L0.666725 -2.96187e-06Z" fill="black"/> </svg>
        </button>
        <img class="gallery-modal__image" src="` + imagePath + `" alt="">
        <div class="gallery-modal__text" data-simplebar>
          <h3 class="gallery-modal__artist">` + modalArtist[imageNumber] + `</h3>
          <h4 class="gallery-modal__title">` + modalTitle[imageNumber] + `</h4>
          <div class="gallery-modal__date">` + modalDate[imageNumber] + `</div>
          <div class="gallery-modal__description">` + modalDescription[imageNumber] + `</div>
        </div>
    `);

    $(".gallery-modal__close").click(() => galleryModal.close());

    galleryModal.open();

    let modal = document.querySelector(".gallery-modal");

    modal.setAttribute("role", "alertdialog");

    // trap focus inside modal
    let closeButton = document.querySelector(".gallery-modal__close");

    galleryFocusTrap = initFocusTrap(event.currentTarget, closeButton, modal);
    galleryFocusTrap.activate();
}

function modalFindBreakpoint() {
    let screenWidth = window.innerWidth;

    for(let i = 0; i < modalImageBreakpoints.length; i++) {
        if (screenWidth > modalImageBreakpoints[i].breakpoint) {
            return modalImageBreakpoints[i].resolution;
        }
    }
}
