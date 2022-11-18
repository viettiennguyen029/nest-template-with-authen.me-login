export default () => ({
  oidcClient: {
    issuer: process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER || '',
    clientId: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID || '',
    secret: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET || '',
    scope: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE || '',
    redirectUrl: process.env.OAUTH2_CLIENT_LOGIN_SUCCESS_REDIRECT || '',
  },
});
