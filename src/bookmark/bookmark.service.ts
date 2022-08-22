import {
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { bookmarkDto } from "./dto/bookmark.dto";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookMark(userId: number, data: bookmarkDto) {
    let bookmark = this.prisma.bookmark.create({
      data: {
        title: data.title,
        description: data.description,
        link: data.link,
        userID: userId,
      },
    });
    return bookmark;
  }

  async getMyBookmarks(userId: number) {
    let bookmarks = await this.prisma.bookmark.findMany({
      where: { userID: userId },
    });

    return bookmarks;
  }

  async getBookmark(userId: number, bookmarkId: number) {
    try {
      let Bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });
      if (Bookmark.userID === userId) {
        return Bookmark;
      } else {
        throw "You can't access this bookmark";
      }
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  async deleteMyBookmark(
    userId: number,
    bookmarkId: number,
  ) {
    try {
      let authenticating =
        await this.prisma.bookmark.findUnique({
          where: { id: bookmarkId },
        });
      if (authenticating.userID === userId) {
        await this.prisma.bookmark.delete({
          where: { id: bookmarkId },
        });
      } else {
        throw "You can't access this bookmark";
      }

      return { Status: "Success" };
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }
}
