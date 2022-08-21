import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    //If true return Token
    return this.signToken(user.id, user.email);
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

      //Return new user
      return this.signToken(user.id, user.email);
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

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret: this.config.get("JWT_SECRET"),
    });
    return {
      access_token: token,
    };
  }
}
