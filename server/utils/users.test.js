const expect = require("expect");
const {Users} = require("./users");

describe("Users", () => {
  var users;

  beforeEach( ()=> {
    
    users = new Users();
    users.users = 
    [
      {
        id: "1",
        name: "Mike",
        room: "Node Course"
      },
      {
        id: "2",
        name: "kralj",
        room: "pistaći"
      },
      {
        id: "3",
        name: "Slike",
        room: "Node Course"
      }
    ];
  });
  it("should add new user", ()=>{
    var users = new Users();
    var user = {
      id: "123", 
      name: "majkl",
      room: "insanity"
    };
    res = users.addUser(user.id, user.name, user.room);
    
    expect(users.users).toEqual([user]);

  });

  it("should return names for node course", ()=> {
    var userList = users.getUserList("Node Course");
    expect(userList).toEqual(["Mike", "Slike"]);
  });

  it("should return names for pistaći", ()=> {
    var userList = users.getUserList("pistaći");
    expect(userList).toEqual(["kralj"]);
  });




  it("should delete a user", ()=> {
    var userId = "1";
    var deletedUser = users.removeUser(userId).name;
    expect(deletedUser).toBe("Mike");
  });

  it("should remove a user",()=>{
    var userId = "1";
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user",()=>{
    var userId = "12313";
    var user = users.removeUser(userId);
    
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it("should find user", () => {
    var userId = "2";
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it("should not find user", () => {
    var userId = "presto";
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

})