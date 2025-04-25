/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
// lazorkit-fix.js
const path = require("path");

// Use dynamic import to handle ESM modules in CommonJS
module.exports = async (...args) => {
  const originalModule = await import("@lazorkit/wallet");
  return originalModule.default || originalModule;
};
