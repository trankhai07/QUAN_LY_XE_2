import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class TokenService {

    constructor(@InjectRepository(Token)
    private tokenRepository: Repository<Token>) {

    }
    async createToken(user: User, refreshToken: string): Promise<void> {
        const refreshTokenOld = await this.tokenRepository.findOne({ where: { user: user } });
        if (refreshTokenOld) {  // trường hợp nếu như token cũ tồn tại thì chỉ cần cập nhật 
            refreshTokenOld.refreshToken = refreshToken;
            await this.tokenRepository.save(
                this.tokenRepository.create(refreshTokenOld)
            );
        }
        else { // trường hợp nếu token ko tồn tại thì tạo mới 
            await this.tokenRepository.save(
                this.tokenRepository.create({ refreshToken, user })
            );
        }

    }
    async deleteToken(user: User): Promise<boolean> {
        try {
            const tokens = await this.tokenRepository.find({ where: { user: user } });
            await this.tokenRepository.remove(tokens);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

}
