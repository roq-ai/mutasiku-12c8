import { BankAccountInterface } from 'interfaces/bank-account';
import { GetQueryInterface } from 'interfaces';

export interface MutationDataInterface {
  id?: string;
  transaction_id: string;
  transaction_amount: number;
  transaction_date: any;
  bank_account_id: string;
  created_at?: any;
  updated_at?: any;

  bank_account?: BankAccountInterface;
  _count?: {};
}

export interface MutationDataGetQueryInterface extends GetQueryInterface {
  id?: string;
  transaction_id?: string;
  bank_account_id?: string;
}
