const Sequelize = require("sequelize");
const db = require("./database");

const User = db.define("user", {
  chatId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
  },
});

// User.prototype.userExists = function(chatId) {
//     if(User.findOne({where: {
//         chatId: chatId
//     }})) {

//     }
// }

module.exports = User;
