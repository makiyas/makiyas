import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

console.log(bucketName);
console.log(region);
const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

async function uploadFile(productName, files) {
  console.log("start");

  const finalArray = [];
  for (const file of files) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParam = {
      Bucket: bucketName,
      Body: fileStream,
      Key: `${productName}/${file.filename}`,
    };

    finalArray.push(await s3.upload(uploadParam).promise());
  }
  return finalArray;
}

async function deleteFile(files) {
  console.log("start");

  for (const file of files) {
    const uploadParam = {
      Bucket: bucketName,
      Key: file,
    };
    console.log("start :::,", file);
    await s3
      .deleteObject(uploadParam, function (err, data) {
        if (err) console.log(err, err.stack);
        // error
        else console.log("Deleted", data); // deleted
      })
      .promise();
  }
}

export { uploadFile, deleteFile };
