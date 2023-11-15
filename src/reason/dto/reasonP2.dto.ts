import { IsOptional, IsString } from "class-validator";

export class ReasonP2{
    @IsString()
    @IsOptional()
    reasonP2: string;
}