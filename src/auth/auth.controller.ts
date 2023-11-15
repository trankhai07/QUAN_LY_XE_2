import { Body, ClassSerializerInterceptor, Controller, Get, Post, Request, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/LocalAuthGuard';
import { RefreshJwtGuard } from './guard/RefreshJwtGuard';
import { JwtGuard } from './guard/JwtAuthGuard';
import { UserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { RolesGuard } from './guard/RoleGuard';
import { UserRole } from 'src/enum/enum.role';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auths')
@ApiBearerAuth()
@Controller({ path: 'auth', version: '2' })
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UsersService) {
    }


    @Post('create')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.ADMIN]))
    createUser(@Body() data: UserDto): Promise<User> {
        return this.userService.createUser(data);
    }

    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    example: '0945854409',
                },
                password: {
                    type: 'string',
                    example: '123456',
                },
            },
        },
    })
    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        console.log(req.user);
        // const loginUser = this.authService.login(req.user);
        // if(loginUser){

        // }
        return this.authService.login(req.user);
    }


    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                refreshToken: {
                    type: 'string',
                }
            },
        },
    })
    @Post('refresh')
    @UseGuards(RefreshJwtGuard)
    refreshToken(@Request() req) {
        console.log(req.user);
        return this.authService.refreshToken(req.user);
    }


}
