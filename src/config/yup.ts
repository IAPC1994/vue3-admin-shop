import * as yup from 'yup';

yup.setLocale({
  mixed: {
    default: 'Is not valid',
    required: 'This field is required',
    oneOf: 'Please, select one value allowed ${values}',
  },
});
