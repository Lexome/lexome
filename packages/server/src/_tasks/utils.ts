import { exists, existsSync } from "fs"
import path = require("path")

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