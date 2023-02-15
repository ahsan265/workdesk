// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://api.gigaaa.link/v1/api/v1',
  backendApi: 'https://api.gigaaa.link/v2',
  analyticsApi: 'https://api.gigaaa.link/v2/analytics',
  oauth_url: 'https://accounts.gigaaa.link/oauth',
  redirect_uri: 'http://localhost:4202/callback',
  uri: 'http://localhost:4202/',
  login: 'https://accounts.gigaaa.link/oauth/token',
  client_id: 8,
  accounts_client_id: 8,
  accounts_url: 'https://accounts.gigaaa.link/oauth',
  accounts_callback_url: 'http://localhost:4202',
  currentUser: 'https://api.gigaaa.link/users/me',
  prod_url_cs: 'https://api.gigaaa.link/cs/v2',
  prod_url_workdesk: 'https://api.gigaaa.link',
  prod_anlytics: 'https://api.gigaaa.link/cs/private',
  websocket_url: 'wss://api.gigaaa.link/cs/v2',
  logged_user: 'https://api.gigaaa.link/v1/api/v1',
  

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
