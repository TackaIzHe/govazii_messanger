import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export function uploadImg(filePath:string){
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, filePath);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            try {
                const hash = crypto.createHash("sha256").update(file.originalname).digest("hex")
                const fileExt = path.extname(file.originalname)
                cb(null, `${hash}${Date.now()}${fileExt}`);
            } catch (err) {
                console.log(err)
            }
        }
    });
    return storage
}