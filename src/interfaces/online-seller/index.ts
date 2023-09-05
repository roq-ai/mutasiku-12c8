import { BankAccountInterface } from 'interfaces/bank-account';
import { UserInvitationInterface } from 'interfaces/user-invitation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OnlineSellerInterface {
  id?: string;
  description?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  bank_account?: BankAccountInterface[];
  user_invitation?: UserInvitationInterface[];
  user?: UserInterface;
  _count?: {
    bank_account?: number;
    user_invitation?: number;
  };
}

export interface OnlineSellerGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
