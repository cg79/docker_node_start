const jsonfile = require('jsonfile');

let sec = null;

class AppConfig {

    config() {
      if(!sec){
        sec  = jsonfile.readFileSync("./settings/app.json");
      }
      return sec;
    }
}

module.exports = new AppConfig().config();


