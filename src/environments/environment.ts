// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://kub-dev.gigaaa.link/v1/api/v1',
  backendApi: 'https://kub-dev.gigaaa.link/v2',
  analyticsApi: 'https://kub-dev.gigaaa.link/v2/analytics',
  oauth_url: "https://accounts.gigaaa.link/oauth",
  redirect_uri: 'http://localhost:4202/callback',
  uri: 'http://localhost:4202/',
  login: 'https://accounts.gigaaa.link/oauth/token',
  client_id: 8,
  accounts_client_id: 8,
  accounts_url: 'https://accounts.gigaaa.link/oauth',
  accounts_callback_url: 'http://localhost:4202',
  currentUser: 'https://kub-dev.gigaaa.link/users/me',
  prod_url_cs:"https://kub-dev.gigaaa.link/cs",
  prod_url_workdesk:"https://kub-dev.gigaaa.link",
  prod_anlytics:"https://kub-dev.gigaaa.link/cs/private-project",
  websocket_url:"wss://kub-dev.gigaaa.link/websockets/cs",
  logged_user:'https://kub-dev.gigaaa.link/v1/api/v1',
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
