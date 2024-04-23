export const allAlertMessages = [
  {
    type: "registration",
    availableStatusAlerts: [
      { code: 1000, msg: "Email already exists", statusCode: 409 },
      { code: 1001, msg: "Something went wrong", statusCode: 500 },
      { code: 1002, msg: "Registration Success", statusCode: 200 },
      { code: 1003, msg: "Invalid email format", statusCode: 400 },
      { code: 1004, msg: "Password too weak", statusCode: 400 },
      { code: 1005, msg: "Api Error", statusCode: 404 },
      { code: 1006, msg: "Please fill all the fields", statusCode: 405 },
    ],
  },
  {
    type: "login",
    availableStatusAlerts: [
      { code: 2000, msg: "Invalid Credentials", statusCode: 401 },
      { code: 2001, msg: "User doesn't exists", statusCode: 402 },
      { code: 2002, msg: "Missing Credentials", statusCode: 403 },
      { code: 2003, msg: "Token Expired", statusCode: 406 },
      { code: 2004, msg: "Something went wrong", statusCode: 404 },
      { code: 2005, msg: "Login Success", statusCode: 200 },
      { code: 2006, msg: "All fields are required", statusCode: 405 },
    ],
  },
  {
    type: "general",
    availableStatusAlerts: [
      {
        code: 4001,
        msg: "Account inactive",
        statusCode: 400
      },
    ],
  },
  {
    type: "email",
    availableStatusAlerts: [
      { code: 5000, msg: "Please try again", statusCode: 409 },
      { code: 5001, msg: "Something went wrong", statusCode: 500 },
      { code: 5002, msg: "Email sent", statusCode: 200 },
      { code: 5002, msg: "User doesn't exists", statusCode: 402 },
      { code: 5003, msg: "Invalid email format", statusCode: 400 },
      { code: 5004, msg: "Unauthorized request", statusCode: 401 },
    ],
  },
  {
    type: "updateAccount",
    availableStatusAlerts: [
      { code: 6000, msg: "Account updation success", statusCode: 200 },
      { code: 6001, msg: "Please try again", statusCode: 401 },
      { code: 6002, msg: "Nothing to update", statusCode: 201 },
      { code: 6003, msg: "Please fill all the fields", statusCode: 400 },
    ],
  },
  {
    type: "chatCards",
    availableStatusAlerts: [
      {
        code: 7000, msg: "Chats retrieved success", statusCode: 201
      },
      {
        code: 7001, msg: "User doesn't exists", statusCode: 404
      },
      {
        code: 7002, msg: "An errror occured", statusCode: 500
      },
      {
        code: 7003, msg: 'Chat created successfully', statusCode: 200
      },
      {
        code: 7004, msg: 'Unauthorized request', statusCode: 400
      },
      {
        code: 7005, msg: 'Chat already exists', statusCode: 209
      },
      // Group chat
      {
        code: 7006, msg: 'Group created', statusCode: 200,
      },
      {
        code: 7007, msg: 'Group chats retrieved', statusCode: 200,
      }
    ]
  }
];

export const methodNotAllowed = {
  code: 3001,
  msg: "Method Not Allowed",
  statusCode: 404,
};


export const SWT = { code: 1001, msg: "Something went wrong", statusCode: 500 };
