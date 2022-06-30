// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://api.gigaaa.link/api/v1',
  backendApi: 'https://api.gconsole.io/v2',
  analyticsApi: 'https://kub-dev.gigaaa.link/v2/analytics',
  oauth_url: 'https://accounts.gconsole.io/oauth',
  redirect_uri: 'http://localhost:4202/callback',
  uri: 'http://localhost:4202/',
  login: 'https://accounts.gconsole.io/oauth/token',
  client_id: 2,
  accounts_client_id: 8,
  accounts_url: 'https://accounts.gconsole.io/oauth',
  accounts_callback_url: 'http://localhost:4202',
  currentUser: 'https://api.gconsole.io/v1/api/v1/current-user'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
