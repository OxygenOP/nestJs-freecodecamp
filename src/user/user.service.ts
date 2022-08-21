import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //   async getme(UserID) {
  //     let user = await this.prisma.user.findUnique({
  //       where: { id: UserID },
  //     });

  // return {
  //   data: {
  //     user: {
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //     },
  //   },
  // };
  //   }
}
