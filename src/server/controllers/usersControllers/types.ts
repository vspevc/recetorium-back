export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterUserBody extends Credentials {
  confirmPassword: string;
  email: string;
}
