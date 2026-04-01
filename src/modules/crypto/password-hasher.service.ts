import argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHasherService {
  async createHash(password: string) {
    return argon2.hash(password);
  }

  async verifyPassword({ password, hash }: { password: string; hash: string }) {
    return argon2.verify(hash, password);
  }
}
