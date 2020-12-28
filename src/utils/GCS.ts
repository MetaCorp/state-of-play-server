const Cloud = require('@google-cloud/storage')
const path = require('path')

const serviceKey = path.join(__dirname, './keys.json')

const gc = new Cloud.Storage({
  keyFilename: serviceKey,
  projectId: 'state-of-play-299420',
})

const bucketName = 'state-of-play'
const bucket = gc.bucket(bucketName)

export const uploadFile = (fileName : any, fileContent : any) : Promise<String> => new Promise((resolve) => {
    console.log('uploadFile: ' + fileName)

    fileContent
        .pipe(
        bucket.file(fileName).createWriteStream({
            resumable: false,
            gzip: true
        })
        )
        .on("finish", () => resolve('https://storage.googleapis.com/' + bucketName + '/' + fileName))
  
})