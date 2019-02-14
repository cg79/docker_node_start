const securityService = require('./security/security');
const genericService = require('./dynamic/forms/genericService');

function getModule(name) {
  switch (name){
    case 'generic':{
      return genericService;
      break;
    }
    case 'security':{
      return securityService;
      break;
    }
  }

};

module.exports.getModule = (name) => getModule(name);
