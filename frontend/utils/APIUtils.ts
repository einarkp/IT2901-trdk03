import axios, { AxiosResponse } from 'axios';
import { URL, PORT } from '../Constants';
import { LoginDetails } from '../Interfaces';
import { createHeader } from './Helpers';

const getAdress = () =>  {
  return URL+':'+PORT+'/';
}


/**
 * intern funskjon som bruker axios sin .get() til å gjøre
 * et api kall mot den ønskede URL adressen
 * @param endpoint hvilke spesefike ressurser som skal etterspøres
 * @returns svar fra API-et i json format
 */
 export async function getData(endpoint: string = ''): Promise<any> {
  const response = await axios.get(getAdress()+endpoint)
  .then((data: AxiosResponse) => {
    return data;
  })
  .catch((error) => {
    console.error('There was an error!', error);
});
  return response 
}

/**
 * funskjon som bruker axios sin .post() til å 
 * sende en login forespørsel
 * @param endpoint hvilke spesefike ressurser som skal etterspøres
 * @returns svar fra API-et i form av true false
 */
export async function loginRequest(dataBody: {}): Promise<LoginDetails> {
  return await axios.post(getAdress()+'login', dataBody, createHeader())
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error) => {
      console.error('There was an error!', error);
      return {successful: false}
  });
}