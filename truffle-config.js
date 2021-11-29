const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",     
      port: 7777,            
      network_id: "1337",       
      }
    },
    compilers: {
        solc: {
           version: "0.8.0",         
           settings: {         
            optimizer: {
              enabled: false,
              runs: 200
            },
           }
        }
    }
};