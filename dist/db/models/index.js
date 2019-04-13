"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _config = _interopRequireDefault(require("../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var basename = _path["default"].basename(__filename);

var db = {};
var sequelize;

if (_config["default"].use_env_variable) {
  sequelize = new _sequelize["default"](process.env[_config["default"].use_env_variable], _config["default"]);
} else {
  sequelize = new _sequelize["default"](_config["default"].database, _config["default"].username, _config["default"].password, _config["default"]);
}

_fs["default"].readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
  var model = sequelize["import"](_path["default"].join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = _sequelize["default"];
module.exports = db;