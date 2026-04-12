export class UserRegistrationEvent {
  constructor(public eventData: { email: string; confirmationCode: string }) {}
}
