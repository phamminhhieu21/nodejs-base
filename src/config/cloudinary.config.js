import cloudinary from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'nodejs-store',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
})
const uploadCloud = multer({storage})
export default uploadCloud