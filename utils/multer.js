const multer = require('multer')
const path = require('path')

// multer config

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname)
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
        cb(new Error('File Type Is Not Supported'), false)
        return
      }
      cb(null, true)
    } catch (e) {
      console.log(e)
    }
  }
})
