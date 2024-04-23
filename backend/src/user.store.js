let user = [];

const addUser = (socketId, userId) => {
   const isUserExist = user.find((id) => id.userId === userId);
   if (!isUserExist) {
      user.push({ socketId, userId });
      console.log(user);
   } else {
      console.log(`User with ID already exists`);
   }
};

const removeUser = (socketId) => {
   user = user.filter((id) => id.socketId !== socketId);
};
export { user, addUser, removeUser };
