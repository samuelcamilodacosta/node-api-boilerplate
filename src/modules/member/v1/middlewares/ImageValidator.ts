import multer from 'multer';
/**
 * módulo para manipulação do nome, destino, validação de extensão
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/upload/members');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString}_${file.originalname}`);
    }
});
export const upload = multer({ storage });

/*
        fileFilter: (req, file, cb) => {
        const imageExtension = ['image/png', 'image/jpg'].find(formatAccepted => formatAccepted === file.mimetype);
        if (imageExtension) return cb(null, true);
        return cb(null, false);
        }
*/
