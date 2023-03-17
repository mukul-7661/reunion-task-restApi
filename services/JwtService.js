const jwt = require("jsonwebtoken");

class JwtService {
  static sign(payload, expiry = "1y", secret = "thisismysecret") {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verify(token, secret = "thisismysecret") {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtService;
