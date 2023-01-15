var contactsValidation;

contactsFormInit();

function contactsFormInit() {
  contactsValidation = new JustValidate(".contacts__form", 
    {
      errorFieldCssClass: 'is-invalid',
      // errorFieldStyle: {
      //   border: '1px solid red', 
        // color: 'cyan', 
      // },
      errorLabelCssClass: "contacts__error", 
      errorLabelStyle: {
        color: "var(--form-red-color)", 
      }, 
      focusInvalidField: true,
      lockForm: true,
    }, 
    [
      {
        key: 'Name is too short',
        dict: {
          ru: 'Имя слишком короткое',
          es: 'El nombre es muy corto',
        },
      },
      {
        key: 'Name is too long',
        dict: {
          ru: 'Длина имени превышает допустимую',
        },
      },
      {
        key: 'Invalid phone number',
        dict: {
          ru: 'Некорректный номер телефона',
        },
      },
      {
        key: 'Name is required',
        dict: {
          ru: 'Укажите имя',
        },
      }, 
      {
        key: 'Phone number is required',
        dict: {
          ru: 'Укажите номер телефона',
        },
      }, 
      {
        key: 'Field is required',
        dict: {
          ru: 'Поле обязательно для ввода',
          es: 'Se requiere campo',
        },
      },
    ], 
  );

  contactsValidation.setCurrentLocale('ru');

  contactsValidation
  .addField('#contacts-name', [
    {
      rule: 'minLength',
      value: 3,
      errorMessage: "Name is too short", 
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: "Name is too long", 
    },
    {
      rule: 'required',
      errorMessage: "Name is required", 
    }, 
  ])
  .addField('#contacts-phone', [
    {
      rule: 'required',
      errorMessage: 'Phone number is required',
    },
    {
      rule: 'customRegexp',
      value: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/,
      errorMessage: "Invalid phone number", 
    },
  ]);

  Inputmask().mask(document.querySelectorAll("input"));
}
