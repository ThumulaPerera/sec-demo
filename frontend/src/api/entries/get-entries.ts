import axios, { AxiosResponse } from "axios";
import { apiUrl } from "./constants";
import { EntryResponse } from "./types/entry";

export async function getEntries(username: string) {
 const options = {
    method: 'GET',
    params: {
      username: username,
    }
  };

  const response = await axios(`${apiUrl}/entries`, options)

  return response as AxiosResponse<EntryResponse[]>;
}
