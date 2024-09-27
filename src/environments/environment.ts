import { LOGIN_TYPE } from 'src/app/constant';

export const environment = {
  production: false,
  title: 'S3 Manager',
  logins: [
    {
      type: LOGIN_TYPE.cognito,
      name: 'Amazon Cognito',
      region: '',
      identityPoolId: '',
      userPoolId: '',
      userPoolWebClientId: '',
    },
    {
      type: LOGIN_TYPE.accessKey,
      name: 'AWS Access Key',
      region: 'us-east-1',
    },
  ],
  accessKey: '',  // Les secrets ne sont pas définis ici
  secretKey: '',
  username: '',
  password: '',
  bucketNames: [
    'recording-huios',
  ]
};


