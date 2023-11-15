

import fs from 'fs';


import path = require('path');


type validFileExtension = 'png' | 'jpg' | 'jpeg' | 'webp';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/webp';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg', 'webp'];
const validMimeTypes: validMimeType[] = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/webp'
];

export const saveImageToStorage = {
    // storage: diskStorage({     // lưu trữ ảnh vào thư mục images trong code
    //     destination: './images',
    //     filename: (req, file, cb) => {
    //         const fileExtension: string = path.extname(file.originalname);
    //         const fileName: string = uuidv4() + fileExtension;
    //         cb(null, fileName);
    //     },
    // }),
    fileFilter: (req, file, cb) => {   // kiểm tra xem file truyền vào có tên như mảng ở trên không 
        const allowedMimeTypes: validMimeType[] = validMimeTypes;
        if (!allowedMimeTypes.includes(file.mimetype)) { // check định dạng ảnh 
            req.fileValiationError = `Không phải định dạng file ảnh: ${allowedMimeTypes.toString()}`;
            cb(null, false);
        } else {
            const fileSize = parseInt(req.headers['content-length']);

            if (fileSize > 1024 * 1024 * 5) {  // giới hạn dung lượng ảnh 
                req.fileValiationError = `Dung lượng lớn hơn  5MB`;
                cb(null, false);
            } else {
                cb(null, true);
            }
        }

    },
};

// export const  isFileExtensionSafe =  (
//     fullFilePath: string,
// ): Observable<boolean> =>  {
//     return from(fileTypeFromFile(fullFilePath)).pipe(
//         switchMap(
//             (fileExtensionAndMimeType: {
//                 ext: validFileExtension;
//                 mime: validMimeType;
//             } | undefined) => {
//                 if (!fileExtensionAndMimeType) return of(false);

//                 const isFileTypeLegit = validFileExtensions.includes(
//                     fileExtensionAndMimeType.ext,
//                 );
//                 const isMimeTypeLegit = validMimeTypes.includes(
//                     fileExtensionAndMimeType.mime,
//                 );
//                 const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
//                 return of(isFileLegit);
//             },
//         ),
//     );
// };

export const removeFile = (fullFilePath: string): void => {
    try {
        fs.unlinkSync(fullFilePath);
    } catch (err) {
        console.error(err);
    }
};