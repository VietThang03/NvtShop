export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'access_token',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
