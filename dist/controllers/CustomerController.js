"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../db/models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Customer = _models["default"].Customer;

var CustomerController =
/*#__PURE__*/
function () {
  function CustomerController() {
    _classCallCheck(this, CustomerController);
  }

  _createClass(CustomerController, null, [{
    key: "getAllUser",

    /**
     * Get all users profile
     * @param {*} req - query parameters
     * @param {*} res - Response object
     * @param {*} next - Next function
     * @returns {object} user - User object
     */
    value: function getAllUser(req, res, next) {
      Customer.findAll().then(function (user) {
        return res.status(200).json({
          status: 200,
          user: user
        });
      })["catch"](next);
    }
  }]);

  return CustomerController;
}();

var _default = CustomerController;
exports["default"] = _default;