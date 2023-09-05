import * as yup from 'yup';

export const accountBalanceValidationSchema = yup.object().shape({
  balance: yup.number().integer().required(),
  balance_date: yup.date().required(),
  bank_account_id: yup.string().nullable().required(),
});
