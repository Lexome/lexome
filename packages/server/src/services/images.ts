import sharp from 'sharp'
import { Storage } from '@google-cloud/storage'
import { prisma } from '../prisma'

const downloadImageFile = async (imageUrl: string): Promise<File> => {
  const image = await fetch(imageUrl)
  const imageBlob = await image.blob()
  const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })
  return imageFile
}

export const createImageThumbnail = async (image: File) => {
  const buffer = await image.arrayBuffer()
  return await sharp(buffer)
    .resize({ width: 200 })       // Resize to 200px wide (height automatically scaled)
    .toFormat('jpeg')             // Convert or ensure output is in JPEG format
    .toBuffer()
}

export const addThumbnailForBookCover = async (bookId) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    },
    select: {
      cover_url: true
    }
  })

  const coverUrl = book?.cover_url

  if (coverUrl) {
    const imageFile = await downloadImageFile(coverUrl)
    const thumbnailBuffer = await createImageThumbnail(imageFile)
    const thumbnailFile = await uploadImageToBucket({
      imageBuffer: thumbnailBuffer,
      bucketName: 'thumbnails',
      fileName: `${bookId}.jpg`
    })

    await prisma.book.update({
      where: {
        id: bookId
      },
      data: {
        thumbnail_url: thumbnailFile.publicUrl()
      }
    })
  }

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


