interface userInterface {
  username: String;
  password: string;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: Number;
  status: Number;
}

interface userData {
  username: String;
  password: string;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: Number;
  status: Number;
}

interface decodedTokenInterface {
  id: string;
  iat: Number;
  exp: Number;
}

export { userInterface, userData, decodedTokenInterface };
