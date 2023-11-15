import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private roles: string[]) {

    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("2");
        try {
            const request = context.switchToHttp().getRequest();
            console.log(request.user);
            
            if (!request.user.role) {
              throw new BadRequestException('Chưa có role');
            }
            return this.roles.includes(request.user.role);
          } catch (error) {
            throw new BadRequestException("Chưa đăng nhập");
          }
    }
}