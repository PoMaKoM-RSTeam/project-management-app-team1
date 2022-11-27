export interface ILogin {
  login: string;
  password: string;
}
export interface IUser {
  _id: string;
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
  id: string;
  login: string;
  iat: number;
  exp: number;
}

export enum LocalStorageKeys {
  authToken = 'authToken',
  userName = 'userName',
  login = 'login',
  userId = 'userId',
}
