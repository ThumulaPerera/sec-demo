import { apiUrl } from "./constants";
import { EntryRequest } from "./types/entry";
import axios from "axios";

export async function postEntry(payload?: EntryRequest) {

  const options = {
    method: 'POST',
    data: payload,
  };

  const response = await axios(`${apiUrl}/entries`, options);
  return response;
}
