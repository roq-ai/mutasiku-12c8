import { AccountBalanceInterface } from 'interfaces/account-balance';
import { MutationDataInterface } from 'interfaces/mutation-data';
import { OnlineSellerInterface } from 'interfaces/online-seller';
import { GetQueryInterface } from 'interfaces';

export interface BankAccountInterface {
  id?: string;
  bank_name: string;
  account_number: string;
  username: string;
  password: string;
  online_seller_id: string;
  created_at?: any;
  updated_at?: any;
  account_balance?: AccountBalanceInterface[];
  mutation_data?: MutationDataInterface[];
  online_seller?: OnlineSellerInterface;
  _count?: {
    account_balance?: number;
    mutation_data?: number;
  };
}

export interface BankAccountGetQueryInterface extends GetQueryInterface {
  id?: string;
  bank_name?: string;
  account_number?: string;
  username?: string;
  password?: string;
  online_seller_id?: string;
}
