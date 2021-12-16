import multer, { Options, memoryStorage } from 'multer';

/**
 * Configurações Multer de armazenamento, validação de formato e tamanho do arquivo.
 */
const multerConfig = {
    storage: memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (request, file, callback) => {
        if (request.path === '/v1/member') {
            const imageExtension = ['image/png', 'image/jpg', 'image/jpeg'].find(formatAccepted => formatAccepted === file.mimetype);
            if (imageExtension) return callback(null, true);
            return callback(new Error('Format file not accepted'));
        }
        return callback(new Error("The requested url doesn't accept file uploads"));
    }
} as Options;

export const upload = multer(multerConfig);
