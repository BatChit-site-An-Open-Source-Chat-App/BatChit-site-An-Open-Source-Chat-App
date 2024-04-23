import axios from "axios";
import { usersBackendURL } from "../utils/usersBackendURL";

export const getSearchedResult = async (query: string) => {

  const searchUser = await axios.get(`${usersBackendURL}/search/${query}`)
  console.log(searchUser.data)
  const { data, success, statusCode } = searchUser.data
  if (success && statusCode === 200) {
    return { data, success }
  }
  else {
    return { success: false }
  }
};
