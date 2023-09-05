import * as yup from 'yup';

export const bankAccountValidationSchema = yup.object().shape({
  bank_name: yup.string().required(),
  account_number: yup.string().required(),
  username: yup.string().required(),
  password: yup.string().required(),
  online_seller_id: yup.string().nullable().required(),
});
