import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from '../utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(email: string, pass: string): Promise<any | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      const{password,...result}=user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {username:user.email,id:user._doc._id};
    const accessToken=this.jwtService.sign(payload);
    return{accessToken,id:user._doc._id};
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }

}
