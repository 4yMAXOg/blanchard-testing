$('.gallery-left__select').each((key, val) => {
    let choice = new Choices(val, {
        allowHTML: true,
        searchEnabled: false,
        placeholder: true,
        shouldSort: false,
        itemSelectText: "",
        labelId: "gallery-left__filter-name", 

        classNames: {
            containerOuter: 'gallery-left__choices gallery-choices choices',
            containerInner: 'choices__inner',
        },
      });
    });

