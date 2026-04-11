export class UserRegistrationEvent {
  constructor(
    public readonly email: string,
    public confirmationCode: string
  ) {}
}
