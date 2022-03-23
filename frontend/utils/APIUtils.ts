import axios, { AxiosResponse } from 'axios';
import { URL, PORT } from '../Constants';
import { LoginDetails } from '../Interfaces';
import { createHeader } from './Helpers';

const getAdress = () => {
  return URL + ':' + PORT + '/';
}

/**
 * intern funskjon som bruker axios sin .get() til å gjøre
 * et api kall mot den ønskede URL adressen
 * @param endpoint hvilke spesefike ressurser som skal etterspøres
 * @returns svar fra API-et i json format
 */
export async function getData(endpoint: string = ''): Promise<any> {
  const response = await axios.get(getAdress() + endpoint)
    .then((data: AxiosResponse) => {
      return data;
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
  return response
}

/**
 * intern funskjon som bruker axios sin .post() til å gjøre
 * et api kall mot den ønskede URL adressen
 * @param endpoint hvilke spesefike ressurser som skal etterspøres
 * @returns svar fra API-et i json format
 */
export async function postRequest(endpoint: string = '', dataBody: {} = {}): Promise<any> {
  const response = await axios.post(getAdress() + endpoint, dataBody, createHeader())
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((error) => {
      console.log(error, response)
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
  return await axios.post(getAdress() + 'login/', dataBody, createHeader()) //, createHeader()
    .then((response: AxiosResponse) => {
      if (response.statusText = 'OK') {
        const loginstatus = response.data;
        loginstatus.successful = true;
        return loginstatus;
      }
      return { successful: false }
    })
    .catch((error) => {
      console.error('There was an error!', error);
      return { successful: false }
    });
}

/**
 * Function used to add new data (or update existing data)
 * @param type the type of data being added/updated, e.g. "accountings", "budgets", needs to match the Django URLs
 * @param data array of object/-s containing the data being added, consists at least schoolID, month, year and amount
 */
 export async function UpdateDatabase(type:string, data:any): Promise<any> {
  return await axios.post(getAdress()+"schools/"+data[0].schoolId+"/"+type+"/", data, createHeader())
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error) => {
      console.error('There was an error!', error);
      return {successful: false}
  });
}

/**
 * Function used to create new predictions for specified school
 * @param schoolId the schoolId of the school to create new predictions for
 */
 export async function CreatePredictions(schoolId: number): Promise<any> {
  return await axios.post(getAdress()+"schools/"+schoolId+"/predictions/", createHeader())
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error) => {
      console.error('There was an error!', error);
      return {successful: false}
  });
}