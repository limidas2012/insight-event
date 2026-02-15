// export interface Use// }

export enum UserRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  token: string;
}
