export class UserPasswordRecoveryEvent {
  constructor(public eventData: { email: string; recoveryCode: string }) {}
}
