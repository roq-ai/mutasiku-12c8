const mapping: Record<string, string> = {
  'account-balances': 'account_balance',
  'bank-accounts': 'bank_account',
  'mutation-data': 'mutation_data',
  'online-sellers': 'online_seller',
  users: 'user',
  'user-invitations': 'user_invitation',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
