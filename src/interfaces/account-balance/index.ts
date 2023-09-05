import { BankAccountInterface } from 'interfaces/bank-account';
import { GetQueryInterface } from 'interfaces';

export interface AccountBalanceInterface {
  id?: string;
  balance: number;
  balance_date: any;
  bank_account_id: string;
  created_at?: any;
  updated_at?: any;

  bank_account?: BankAccountInterface;
  _count?: {};
}

export interface AccountBalanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  bank_account_id?: string;
}
