import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string) {
    const SALT = bcrypt.genSaltSync();  // truyền tham số vào hàm genSaltSync là số vòng lặp tạo chuỗi (mặc định là 10 có thể tùy chỉnh)
    return bcrypt.hashSync(rawPassword, SALT);  // băm mật khẩu với số vòng lặp SALT
}

export function comparePassword(rawPassword: string, hash: string) {
    return bcrypt.compareSync(rawPassword,hash);
}