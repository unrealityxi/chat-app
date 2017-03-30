var moment = require("moment");

function generateMessage(from, text){
  return {
    from, 
    text,
    createdAt: moment().valueOf()
  }
};

function generateLocationMessage(from, lat, long){
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    createdAt: moment().valueOf()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
};

