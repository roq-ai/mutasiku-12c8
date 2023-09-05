import { UserInterface } from 'interfaces/user';
import { OnlineSellerInterface } from 'interfaces/online-seller';
import { GetQueryInterface } from 'interfaces';

export interface UserInvitationInterface {
  id?: string;
  invited_user_id: string;
  inviting_user_id: string;
  online_seller_id: string;
  created_at?: any;
  updated_at?: any;

  user_user_invitation_invited_user_idTouser?: UserInterface;
  user_user_invitation_inviting_user_idTouser?: UserInterface;
  online_seller?: OnlineSellerInterface;
  _count?: {};
}

export interface UserInvitationGetQueryInterface extends GetQueryInterface {
  id?: string;
  invited_user_id?: string;
  inviting_user_id?: string;
  online_seller_id?: string;
}
