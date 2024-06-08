"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spec_1 = require("../src/api/spec");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const specString = JSON.stringify(spec_1.apiSpec, null, 2);
// save to api.json at root of this directory using node.js fs API
const saveSpec = () => {
    const filePath = path_1.default.join(__dirname, '../api.json');
    console.log('Saving spec to', filePath);
    console.log('Spec:', specString);
    fs_1.default.writeFileSync(filePath, specString);
};
saveSpec();
