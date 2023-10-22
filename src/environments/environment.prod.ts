import 'angular-server-side-configuration/process';

export const environment = {
  production: true,
  apiUrl: process.env.API_URL || 'https://api.gigaaa.link/v1/api/v1',
  backendApi: process.env.BACKEND_API || 'https://api.gigaaa.link/v2',
  analyticsApi:
    process.env.ANALYTICS_API || 'https://api.gigaaa.link/v2/analytics',
  oauth_url: process.env.OAUTH_URL || 'https://accounts.dev.gconsole.io/oauth',
  redirect_uri: process.env.REDIRECT_URI || 'http://localhost:4202/callback',
  uri: process.env.URI || 'http://localhost:4202/',
  login: process.env.LOGIN || 'https://accounts.dev.gconsole.io/oauth/token',
  client_id: Number(process.env.CLIENT_ID) || 8,
  accounts_client_id: Number(process.env.ACCOUNTS_CLIENT_ID) || 8,
  accounts_url:
    process.env.ACCOUNTS_URL || 'https://accounts.dev.gconsole.io/oauth',
  accounts_callback_url:
    process.env.ACCOUNTS_CALLBACK_URL || 'http://localhost:4202',
  currentUser: process.env.CURRENT_USER || 'https://api.gigaaa.link/users/me',
  prod_url_cs: process.env.PROD_URL_CS || 'https://api.gigaaa.link/cs/v2',
  prod_url_workdesk: process.env.PROD_URL_WORKDESK || 'https://api.gigaaa.link',
  prod_anlytics:
    process.env.PROD_ANALYTICS || 'https://api.gigaaa.link/cs/private',
  websocket_url: process.env.WEBSOCKET_URL || 'wss://api.gigaaa.link/cs/v2',
  logged_user: process.env.LOGGED_USER || 'https://api.gigaaa.link/v1/api/v1',
  register_account:
    process.env.ACCOUNTS_UI_REGISTER_URL ||
    'https://accounts.dev.gconsole.io/register'
};
