import { IsOptional, IsString } from "class-validator";

export class ReasonDto {
    id_reason: number;

    @IsString()
    @IsOptional()
    reason_cancel_department: string | null


    time_cancel: Date | null;

    time_booking_department: Date | null;

    @IsString()
    @IsOptional()
    reason_cancel_reviewer: string | null;

    time_cancel_reviewer: Date | null;

    time_booking_reviewer: Date | null;

    name_reviewer: string | null;

    id_booking: number;
}