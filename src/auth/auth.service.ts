import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: AuthDto) {
    //Get User Using Email
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //Validate User
    if (!user) {
      throw new ForbiddenException(
        "Incorrect Credentials Check your Email/Password",
      );
    }
    //Compare Password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    if (!pwMatches) {
      throw new ForbiddenException(
        "Incorrect Credentials Check your Email/Password",
      );
    }

    delete user.hash;
    //If true return Token
    return user;
  }
  async register(dto: AuthDto) {
    //Generate Password Hash
    try {
      const hash = await argon.hash(dto.password);
      //Make a new User Entry
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstname,
          lastName: dto.lastname,
        },
      });
      delete user.hash;

      //Return new user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException(
            "Crediantials Un-Available",
          );
        }
      }
      throw error;
    }
  }
}
