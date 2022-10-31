export interface ILogin {
  login: string;
  password: string;
}
export interface IUser {
  id: string;
  name: string;
  login: string;
}

export interface IUserCredentials {
  name: string;
  login: string;
  password: string;
}

export type TUserSignIn = Omit<IUserCredentials, 'name'>;

export interface ITokenInfo {
  userId: string;
  login: string;
  iat: number;
}

export enum LocalStorageKeys {
  authToken = 'authToken',
  login = 'login',
  userId = 'userId',
}
