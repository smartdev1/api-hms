import { IsString, IsOptional } from 'class-validator';

export class UpdateUtilisateurDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  telephone?: string;
}
