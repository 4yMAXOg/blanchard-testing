    // Функция ymaps.ready() будет вызвана, когда
    // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
    ymaps.ready(addressMapInit);

    function addressMapInit(){
        // Создание карты.
        var myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [55.758468, 37.601088],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 14,
            controls: [],
        });

        myMap.behaviors.disable('drag');

        let myPlacemark = new ymaps.Placemark([55.758468, 37.601088], 
            {}, 
            {
            iconLayout: 'default#image',
            iconImageHref: 'images/icons/map-dot.svg',
            iconImageSize: [20, 20],
            // iconImageOffset: [-3, -42]
        });



        myMap.geoObjects.add(myPlacemark);
        myMap.behaviors.disable(['scrollZoom']);
    }
