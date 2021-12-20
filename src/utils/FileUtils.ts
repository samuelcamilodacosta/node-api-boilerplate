import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { unlinkSync, writeFileSync } from 'fs';

/**
 * FileUtils
 *
 * Classe de utilidades para manipular arquivos
 */
export class FileUtils {
    /**
     * savePhoto
     *
     * Salva a imagem recebida no req.file ao endereço definido no path
     *
     * @param req Request
     * @param res Response
     * @returns Nome da foto gerada.
     */
    public static savePhoto(req: Request, res: Response): string | undefined {
        if (req.file) {
            const fileBuffer = req.file.buffer;
            const path = './public/upload/members/';
            const hash = randomBytes(64).toString('hex');
            const filename = `${Date.now()}_${hash}_${req.file?.originalname}`;
            const fullFilePath = `${path}${filename}`;

            try {
                writeFileSync(fullFilePath, fileBuffer, { encoding: 'base64', flag: 'wx' });
                return filename;
            } catch (error) {
                res.status(500);
                res.json({
                    status: false,
                    date: new Date().toISOString(),
                    error: "Couldn't save image"
                });
            }
        }
        return undefined;
    }

    /**
     * deletePhoto
     *
     * Apaga um arquivo da pasta do diretório path que possua o nome passado
     *
     * @param filename Nome do arquivo para deletar
     */
    public static deletePhoto(filename: string): void {
        const path = './public/upload/members/';
        unlinkSync(path + filename);
    }
}
