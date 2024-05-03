export const BaseConfiguration = {
  production: false,
  environment: 'localhost',
  tenant: 'lubetech',
  theme: 'lubetech',
  title: 'Shop Lubetech',
  faviconUrl: '',
  imageUrlFront: 'https://ltcdnstorage.blob.core.windows.net/images/',
  apiUrl: 'https://lt-web-api-v5-dev.azurewebsites.net/api/',
  // locationUrl: 'http://localhost:4200/',
  fileShareApiUrl: 'https://webapi.lubetech.com/api/',
  logoUrl:
    'https://ltcdnstorage.blob.core.windows.net/images/brands/Lube-Tech.jpg',
  appInsightsInstrumentationKey: 'a3695a50-4274-47ab-bc49-64e35532270a',
  holidayMessage: '',
  logInfo: true,
  siteDown: false,
  showCreditCard: true,
  showViscosity: false,
  showRangeCodes: false,
  filterBrands: ['all'],
  navBrands: ['103', '188', '132', '493', '652', '456', '542'],
  auth0_domain: 'lubetech.auth0.com',
  auth0_clientId: 'VALEaD5YaG20v3Kx2lasBK5bBMJvNdz3',
  auth0_appName: 'https://Lubetech.com',
  auth0_audience: 'https://webapi.lubetech.com',
  auth0_redirectUrl: 'http://localhost:4200/callback',
  auth0_roles: [
    {
      id: '6a18e90c-7fdf-4137-b60e-975e97fd4a13',
      name: 'Lubetech Account Manager',
    },
    { id: '833d00fc-21de-4e20-b2d0-78d5bd6b22c5', name: 'Lubetech Admin' },
    {
      id: '6f36b4a0-49fb-40a6-b37a-605192f6bbe7',
      name: 'Lubetech Customer Service',
    },
    {
      id: 'da29f4fd-5147-419e-bb93-38223edd21d7',
      name: 'Lubetech -- No Orders',
    },
    {
      id: '6fe5003a-1cf2-4582-9b9e-6bfd087f7e0b',
      name: 'Lubetech Salesperson',
    },
    { id: '3bd5f23d-1a5f-4f35-8278-ccb5b6eca64f', name: 'ShipTo Admin' },
    { id: '3684d4d5-b66b-479d-a60e-9ac3a19f09fc', name: 'ShipTo PowerUser' },
    { id: 'd043170d-718c-43a5-bf10-0c9fa8ce31bd', name: 'ShipTo Purchaser' },
    { id: '1742aaae-a9ce-4a35-bf04-05ef3b1230cc', name: 'ShipTo -- NoOrders' },
  ],
  auth0_token_body: {
    client_id: 'mHIfKKcGvkbYRe54AF1XkhGtmbH4dXgc',
    client_secret:
      'WXToaQCyDGx9sOu3p_1yGdq0ZtIxOXZAz8y_3bklszUGzmIAMzpse8oo485gbOVW',
    audience: 'https://lubetech.auth0.com/api/v2/',
    grant_type: 'client_credentials',
  },
  auth0_token_url: 'https://lubetech.auth0.com/oauth/token',
  auth0_role_token_body: {
    client_id: 'mHIfKKcGvkbYRe54AF1XkhGtmbH4dXgc',
    client_secret:
      'WXToaQCyDGx9sOu3p_1yGdq0ZtIxOXZAz8y_3bklszUGzmIAMzpse8oo485gbOVW',
    audience: 'urn:auth0-authz-api',
    grant_type: 'client_credentials',
  },
  auth0_user_url: 'https://lubetech.auth0.com/api/v2/users',
  auth0_user_roles_url:
    'https://lubetech.us8.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/users',
  auth0_user_list_url:
    'https://lubetech.auth0.com/api/v2/users?q=app_metadata.shipto%3A',
};
