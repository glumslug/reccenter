const {S3} = require('aws-sdk')
const path = require('path');

exports.s3Uploadv2 = async (file) =>{
    const s3 = new S3()

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${file.originalname.split(".")[0]}-${Date.now()}${path.extname(file.originalname)}`,
        Body: file.buffer
    }
    return await s3.upload(params).promise();
    
}


exports.s3delete = async(filename)=>{
    const s3 = new S3()
    if(filename === 'user-solid.svg'){
        return 'first upload'
    }
    return await s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: `uploads/${filename}`}).promise()
    
}