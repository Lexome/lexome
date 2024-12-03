const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');

const downloadImageFile = async (imageUrl: string): Promise<File> => {
  const image = await fetch(imageUrl)
  const imageBlob = await image.blob()
  const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })
  return imageFile
}

export const createImageThumbnail = async (image: File) => {
  return await sharp(image)
    .resize({ width: 200 })       // Resize to 200px wide (height automatically scaled)
    .toFormat('jpeg')             // Convert or ensure output is in JPEG format
    .toBuffer()
}

const uploadImageToBucket = async (params:{
  imageBuffer: Buffer,
  bucketName: string,
  fileName: string
}) => {
  const { imageBuffer, bucketName, fileName } = params

  const storage = new Storage({
    keyFilename: 'path/to/your/keyfile.json'
  });

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.save(imageBuffer, {
    resumable: false, // simpler upload; disable if file is small
    metadata: {
      contentType: 'image/jpeg',
    }
  })

  return file
}


