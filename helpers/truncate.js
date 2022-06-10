const {User, Biodata, History} = require('../models')

module.exports = {
    user: () => {
      return User.destroy({ truncate: true, restartIdentity: true });
    },
    biodata: () => {
      return Biodata.destroy({ truncate: true, restartIdentity: true });
    },
    history: () => {
      return History.destroy({ truncate: true, restartIdentity: true });
    },
  };
  