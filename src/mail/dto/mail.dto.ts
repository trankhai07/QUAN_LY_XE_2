import { IsEmail } from "class-validator";

export class MailDto{
    
    @IsEmail({},{message: 'Mail không đúng định dạng vui lòng nhập lại'})
    email: string;
}