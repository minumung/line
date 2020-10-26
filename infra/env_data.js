const path = require('path');
var dotenv = require('dotenv');
dotenv.config({           
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV = ".env."+process.env.NODE_ENV
  )
});
module.exports = {
    impkey: process.env.IMP_KEY,
    impsecret: process.env.IMP_SECRET,
};
