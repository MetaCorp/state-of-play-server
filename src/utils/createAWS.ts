const AWS = require('aws-sdk');
// import { readFileSync } from "fs";
const stream = require('stream');

// Enter copied or downloaded access ID and secret key here
const ID = 'AKIAJKVUXSE567WOAJTQ';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'state-of-play';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

export const uploadFile = (fileName : any, fileContent : any) => new Promise((res,rej) => {
    // Read content from the file
    // const fileContent = readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err : any, data : any) {
        if (err) {
            rej(err)
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        res(data.Location);
    });
});

// @ts-ignore
export const uploadStream = ({ Bucket, Key }) => {
    const s3 = new AWS.S3();
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
    };
}