// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://api.dev.gconsole.io/v1/api/v1',
  backendApi: 'https://api.dev.gconsole.io/v2',
  analyticsApi: 'https://api.dev.gconsole.io/v2/analytics',
  oauth_url: 'https://accounts.dev.gconsole.io//oauth',
  redirect_uri: 'http://localhost:4202/callback',
  uri: 'http://localhost:4202/',
  login: 'https://accounts.dev.gconsole.io/oauth/token',
  client_id: 8,
  accounts_client_id: 8,
  accounts_url: 'https://accounts.dev.gconsole.io/oauth',
  accounts_callback_url: 'http://localhost:4202',
  currentUser: 'https://api.dev.gconsole.io/users/me',
  prod_url_cs: 'https://api.dev.gconsole.io/cs/v2',
  prod_url_workdesk: 'https://api.dev.gconsole.io',
  prod_anlytics: 'https://api.dev.gconsole.io/cs/private',
  websocket_url: 'wss://api.dev.gconsole.io/cs/v2',
  logged_user: 'https://api.dev.gconsole.io/v1/api/v1',
  register_account:'https://accounts.dev.gconsole.io/register',

  iceServerConfiguration: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'turn:turn.gigaaa.com:80?transport=tcp',
      username: 'username',
      credential: 'password'
    },
    {
      urls: 'turns:turn.gigaaa.com:5349',
      username: 'username',
      credential: 'password'
    },
    {
      urls: 'turn:turn.gigaaa.com:3478',
      username: 'username',
      credential: 'password'
    }
  ],

  iceserversConfigsfirefox: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'turns:turn.gigaaa.com:5349',
      username: 'username',
      credential: 'password'
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
