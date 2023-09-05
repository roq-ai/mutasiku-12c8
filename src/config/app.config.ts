interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: [],
  tenantRoles: ['Business Owner', 'Financial Manager', 'Accountant', 'Customer Service Agent'],
  tenantName: 'Online Seller',
  applicationName: 'Mutasiku',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [],
  ownerAbilities: [
    'Manage Online Seller entity account',
    'Manage bank account details',
    'Manage application users',
    'Manage user roles',
  ],
};
