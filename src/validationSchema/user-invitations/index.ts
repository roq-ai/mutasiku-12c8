import * as yup from 'yup';

export const userInvitationValidationSchema = yup.object().shape({
  invited_user_id: yup.string().nullable().required(),
  inviting_user_id: yup.string().nullable().required(),
  online_seller_id: yup.string().nullable().required(),
});
