import {
  Controller,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { Request } from "express";
import { jwtGuard } from "src/auth/jwtGuard";
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  //
  constructor(private userService: UserService) {}

  @UseGuards(jwtGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
    console.log(user);
    // return this.userService.getme(req.user["sub"]);
    return user;
  }
}
