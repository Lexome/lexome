import { apiSpec } from '../src/api/spec'
import fs from 'fs'
import path from 'path'

const specString = JSON.stringify(apiSpec, null, 2)

// save to api.json at root of this directory using node.js fs API
const saveSpec = () => {
  const filePath = path.join(__dirname, '../api.json')
  console.log('Saving spec to', filePath)
  console.log('Spec:', specString)
  fs.writeFileSync(filePath, specString)
}

saveSpec()



