import {
  Controller,
  Post,
  Get,
  UseGuards,
  Delete,
  Body,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { jwtGuard } from "../auth/jwtGuard";
import { BookmarkService } from "./bookmark.service";
import {
  bookmarkDto,
  deleteBookmarkDto,
} from "./dto/bookmark.dto";

@Controller("bookmark")
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @UseGuards(jwtGuard)
  @Post("")
  createBookmark(
    @GetUser() user: User,
    @Body() dto: bookmarkDto,
  ) {
    return this.bookmarkService.createBookMark(
      user.id,
      dto,
    );
  }

  @UseGuards(jwtGuard)
  @Get("")
  myBookmarks(@GetUser() user: User) {
    return this.bookmarkService.getMyBookmarks(user.id);
  }

  @UseGuards(jwtGuard)
  @Get("bookmark")
  getBookmark(
    @GetUser() user: User,
    @Body() dto: { id: number },
  ) {
    console.log("Started", dto, user);
    return this.bookmarkService.getBookmark(
      user.id,
      dto.id,
    );
  }

  @UseGuards(jwtGuard)
  @Delete("")
  deleteMyBookmark(
    @GetUser() user: User,
    @Body() dto: deleteBookmarkDto,
  ) {
    return this.bookmarkService.deleteMyBookmark(
      user.id,
      dto.id,
    );
  }
}
