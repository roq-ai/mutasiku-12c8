import * as yup from 'yup';

export const mutationDataValidationSchema = yup.object().shape({
  transaction_id: yup.string().required(),
  transaction_amount: yup.number().integer().required(),
  transaction_date: yup.date().required(),
  bank_account_id: yup.string().nullable().required(),
});
