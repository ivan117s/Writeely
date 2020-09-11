//multer
import multer from 'multer';
import {v4} from 'uuid';

const storage = multer.diskStorage(
{
    destination:  'images',
    filename: (req, file, cb) =>
    {
        cb(null, v4() + ".png")
    }
})

export default multer({storage: storage});