import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleadDb();
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    describe("Register", () => {});
    describe("Login", () => {});
  });
  describe("User", () => {
    describe("Get me", () => {});

    describe("Edit User", () => {});
  });
  describe("Bookmarks", () => {
    describe("Get Bookmarks", () => {});
    describe("Get Bookmark", () => {});
    describe("Create Bookmarks", () => {});

    describe("Delete Bookmark", () => {});
  });
});
