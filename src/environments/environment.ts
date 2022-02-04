
// for production server testing

export const environment = {
  production: true,
  apiUrl: 'https://api.gconsole.io/v1/api/v1',
  backendApi: 'https://api.gconsole.io/v2',
  client_id: 8,
  oauth_url: "https://accounts.gconsole.io/oauth",
  accounts_url: 'https://accounts.gconsole.io/oauth',
  redirect_uri: 'http://localhost:4202/callback',
  uri: 'http://localhost:4202',
  //
  accounts_callback_url: 'http://localhost:4202',
  accounts_client_id: 8,

  //
  prod_url_cs:"https://api.gconsole.io/cs",
  prod_url_workdesk:"https://api.gconsole.io/v2",
  prod_anlytics:"https://api.gconsole.io/analytics",
  //
  websocket_url:"wss://api.gconsole.io/websockets",
  // 
  logged_user:'https://api.gconsole.io/v1/api/v1',

};

