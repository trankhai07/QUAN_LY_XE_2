import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";

@ValidatorConstraint({ name: "isEqual", async: false })
export class IsEqualValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must be equal to ${relatedPropertyName}`;
    }
}

export class UpdatePasswordDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu cũ' })
    @Matches(/^[0-9]{6}$/, {
        message: 'Mật khẩu phải là chuỗi số và có đúng 6 ký',
    })
    passwordOld: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới' })
    @Matches(/^[0-9]{6}$/, {
        message: 'Mật khẩu phải là chuỗi số và có đúng 6 ký',
    })
    passwordNew: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập lại mật khẩu mới' })
    @Validate(IsEqualValidator, ["passwordNew"], {
        message: "Mật khẩu nhập lại không khớp",
    })
    repeatPassword: string;
}