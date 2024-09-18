import path from "path";
import fs from "fs";

const isObject = (value: any) => {
  return value && typeof value === 'object'
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

const LOG_DIRECTORY = path.join(process.cwd(), 'logs')

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
