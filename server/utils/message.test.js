var expect = require("expect");
var {generateMessage, generateLocationMessage} = require("./message");

describe("generateMessage", () => {
  it("should generate the correct message object", ()=>{
    // store res in variable 
    // assert from match
    // assert text match
    // assert createdAt is number
    var from = "jen";
    var text = "Some message";
    var message = generateMessage(from, text);
    
    expect(message.createdAt).toBeA("number");
    expect(message).toInclude({
      from, 
      text
    });
  });
});

describe("generateLocationMessage", ()=>{
  it("should generate correct location object", ()=>{
    var from = "admin";
    var lat = 1;
    var lng = 1;
    var url = "https://www.google.com/maps?q=1,1";
    var msg = generateLocationMessage(from, lat, lng);

    expect(msg.createdAt).toBeA("number");
    expect(msg).toInclude({from, url});

  });
})