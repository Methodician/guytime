export class AuthInfo {
  constructor(
    readonly uid: string,
    readonly emailVerified = false,
    readonly displayName?: string,
    readonly email?: string,
  ) {}

  isLoggedIn() {
    return !!this.uid;
  }

  isEmailVerified() {
    return !!this.emailVerified;
  }
}
