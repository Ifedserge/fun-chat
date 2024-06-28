import TypeReq from './enumTypeReq';
import TypeResp from './enumTypeRes';

export interface UserLoginRequest {
  id: string;
  type: TypeReq.USER_LOGIN;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface USerLoginResponse {
  id: string;
  type: TypeResp.USER_LOGIN;
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export interface ErrorResponse {
  id: string;
  type: TypeResp.ERROR;
  payload: {
    error: 'a user with this login is already authorized';
  };
}
