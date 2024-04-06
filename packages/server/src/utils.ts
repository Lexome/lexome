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