import multer, { StorageEngine } from "multer"

const productStorage: StorageEngine = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

export const upload = multer({ storage: productStorage }).single("profilePic")
