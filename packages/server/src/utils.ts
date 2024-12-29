import path from "path";
import fs, { existsSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const isObject = (value: any) => {
  return value && typeof value === 'object'
}

export const convertObjectPropertiesToSnakeCase = <T = any>(obj: any): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectPropertiesToSnakeCase) as T;
  }

  const newObject: any = {}

  for (const key in obj) {
    const value = obj[key];

    const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

    if (typeof value === 'object') {
      newObject[newKey] = convertObjectPropertiesToSnakeCase(value);
    } else {
      newObject[newKey] = value;
    }
  }

  return newObject as T
}


export const convertObjectPropertiesToCamelCase = <T = any>(obj: any): T  => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectPropertiesToCamelCase) as T;
  }

  const newObject: any = {}

  for (const key in obj) {
    const value = obj[key];

    const newKey = key.replace(/_(\w)/g, (match, letter) => letter.toUpperCase());

    if (typeof value === 'object') {
      newObject[newKey] = convertObjectPropertiesToCamelCase(value);
    } else {
      newObject[newKey] = value;
    }
  }

  return newObject as T
}

export const TEMP_DIRECTORY = path.join(process.cwd(), 'temp')

export const initializeTempDirectory = () => {
  if (!fs.existsSync(TEMP_DIRECTORY)) {
    fs.mkdirSync(TEMP_DIRECTORY)
  }
}

export const LOG_DIRECTORY = path.join(process.cwd(), 'logs')

export const saveLog = (params: {
  message: string | Record<string, any>,
  filename?: string,
}) => {
  let { message, filename } = params

  // create the log directory if it doesn't exist
  if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY)
  }

  if (!filename) {
    // Find the highest number log file matching the pattern log-<number>.txt
    const logFiles = fs.readdirSync(LOG_DIRECTORY).filter(file => file.startsWith('log-') && file.endsWith('.txt'))
    const logNumbers = logFiles.map(file => parseInt(
      file
        .split('-')[1]
        .split('.')[0]
    ))
    
    let highestLogNumber = 0

    if (logNumbers.length > 0) {
      highestLogNumber = Math.max(...logNumbers)
    }

    filename = `log-${highestLogNumber + 1}`
  }

  const logFilePath = path.join(LOG_DIRECTORY, `${filename}.txt`)

  if (typeof message === 'object') {
    message = JSON.stringify(message)
  }

  fs.appendFileSync(logFilePath, message)
}

export const uploadFileToS3 = async (params: {
  file: string,
  bucket: string,
  key: string,
}): Promise<string> => {
  const s3 = new S3Client({
    region: 'us-east-1',
  })

  await s3.send(new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    Body: fs.readFileSync(params.file),
  }))

  return `https://${params.bucket}.s3.amazonaws.com/${params.key}`
}

export const findPackageRoot = () => {
  // Check if dirname has package.json
  // If not, go up until a package.json is found
  let currentDir = __dirname

  while (true) {
    const packagePath = path.join(currentDir, 'package.json')
    const packageExists = existsSync(packagePath)

    if (packageExists) {
      return currentDir
    }
    
    if (currentDir === '/') {
      return null
    }

    currentDir = path.join(currentDir, '..')
  }
}