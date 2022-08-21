import { IsNumber, IsString, IsUrl } from "class-validator";

export class bookmarkDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  link: string;
}

export class deleteBookmarkDto {
  @IsNumber()
  id: number;
}
