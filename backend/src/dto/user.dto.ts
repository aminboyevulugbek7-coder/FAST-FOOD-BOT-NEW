import { IsNumber, IsString, MinLength, Matches, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  telegramId!: number;

  @IsString()
  @MinLength(2)
  firstName!: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @Matches(/^\+998\d{9}$/)
  phone!: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @Matches(/^\+998\d{9}$/)
  @IsOptional()
  phone?: string;
}
