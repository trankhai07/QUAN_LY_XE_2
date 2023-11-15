import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/LocalStrategy';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/department/entities/department.entity';
import { Vehicle } from 'src/vehicles/entities/vehicles.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/JwtStrategy';
import { RefreshJwtStrategy } from './strategy/RefreshJwtStrategy';
import { Token } from 'src/token/entities/token.entity';
import { TokenService } from 'src/token/token.service';
import { RolesGuard } from './guard/RoleGuard';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Department, Vehicle, Token]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('ACCESS_EXPIRESIN') },
      }),
      inject: [ConfigService],
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UsersService,
    VehiclesService, DepartmentService, JwtStrategy,RefreshJwtStrategy, TokenService]
 
})
export class AuthModule { }
