import { IsMongoId, IsNumber, IsString, IsArray, ValidateNested, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class AudioUploadDto {
  @IsMongoId()
  etablissement_id: string;

  @IsNumber()
  @Type(() => Number)
  @Min(10)
  @Max(60)
  duree_secondes: number;

  @IsDateString()
  timestamp_capture: string;
}

class CaptureSyncItem {
  @IsString()
  reference_locale: string;

  @IsString()
  audio_base64: string;

  @IsDateString()
  timestamp_capture: string;

  @IsNumber()
  @Min(10)
  @Max(60)
  duree_secondes: number;
}

export class SyncPayloadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaptureSyncItem)
  captures: CaptureSyncItem[];
}
