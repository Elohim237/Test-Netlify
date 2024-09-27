export const SESSION_KEY_ACCESS_KEY = 's3manager.accessKey';

export const LOCAL_KEY_REGION = 's3manager.region';
export const LOCAL_KEY_LOGIN_TYPE = 's3manager.loginType';
export const LOCAL_KEY_LOGIN_INDEX = 's3manager.loginIndex';
export const LOCAL_KEY_BUCKETS = 's3manager.buckets';
export const LOCAL_KEY_USERNAME = 's3manager.username';
export const SUPER_ADMIN_USERNAME = 'super-admin';

export const enum LOGIN_TYPE {
  cognito = '0',
  accessKey = '1',
}
