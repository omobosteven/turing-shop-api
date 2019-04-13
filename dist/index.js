"use strict";

var _express = _interopRequireDefault(require("express"));

var _CustomerController = _interopRequireDefault(require("./controllers/CustomerController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = 3000;
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.get('/', function (req, res) {
  return res.status(200).json({
    status: 200,
    message: 'Turing App!!!'
  });
});
app.get('/user', _CustomerController["default"].getAllUser);
app.listen(port, function () {
  return console.log("app listening on port ".concat(port, "!"));
});