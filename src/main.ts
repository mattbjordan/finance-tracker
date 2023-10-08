import axios, { AxiosRequestConfig } from 'axios';
import Plaid, { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products, SandboxPublicTokenCreateRequest, LinkSessionSuccess } from 'plaid';
import dotenv from 'dotenv';

console.log("Hello World.");

dotenv.config();

// Set up the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const client = new PlaidApi(configuration);

const linkTokenConfig: LinkTokenCreateRequest = {
  user: { client_user_id: process.env.CLIENT_ID! },
  client_name: "Plaid Tutorial",
  language: "en",
  products: [Products.Auth],
  country_codes: [CountryCode.Us],
  webhook: "https://www.example.com/webhook",
};
const tokenResponse = await client.linkTokenCreate(linkTokenConfig);
const tokenData = tokenResponse.data;
// res.json(tokenData);
console.log(tokenData);

// client.sandboxPublicTokenCreate({})

import {
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
  usePlaidLink 
} from 'react-plaid-link';

let publicToken = "";

const { open, ready } = usePlaidLink({
  token: tokenData.link_token,
  onSuccess: (public_token, metadata) => {
    // send public_token to server
    console.log("hello link");
    publicToken = public_token;
  }
});

while (!ready) {
  // wait...
}

const response = await client.itemPublicTokenExchange({ public_token: publicToken });
const access_token = response.data.access_token;
const accounts_response = await client.accountsGet({ access_token });
const accounts = accounts_response.data.accounts;

console.log({accounts});


// const onSuccess = useCallback<PlaidLinkOnSuccess>(
//   (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
//     // log and save metadata
//     // exchange public token
//     fetch('//yourserver.com/exchange-public-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: {
//         public_token,
//       },
//     });
//   },
//   [],
// );


// addEventListener("success", (event) => {});

// onsuccess = (event) => {};

// await client.linkTokenCreate(linkTokenConfig).then((res) => {
//   onSuccess: console.log({res});
//   // onSuccess()
// })

// const c3: LinkSessionSuccess = {}

// // const c2: PlaidLinkOptions = {};
// // const onSuccess = 

// const c: SandboxPublicTokenCreateRequest = {};

// client.itemPublicTokenExchange({})

// const startLink = function () {
//   if (linkTokenData === undefined) {
//     return;
//   }
//   const handler = Plaid.create({
//     token: linkTokenData.link_token,
//     onSuccess: async (publicToken, metadata) => {
//       console.log(`ONSUCCESS: Metadata ${JSON.stringify(metadata)}`);
//       showOutput(
//         `I have a public token: ${publicToken} I should exchange this`
//       );
//       publicTokenToExchange = publicToken;
//       document.querySelector("#exchangeToken").removeAttribute("disabled");
//     },
//     onExit: (err, metadata) => {
//       console.log(
//         `Exited early. Error: ${JSON.stringify(err)} Metadata: ${JSON.stringify(
//           metadata
//         )}`
//       );
//       showOutput(`Link existed early with status ${metadata.status}`)
//     },
//     onEvent: (eventName, metadata) => {
//       console.log(`Event ${eventName}, Metadata: ${JSON.stringify(metadata)}`);
//     },
//   });
//   handler.open();
// };


console.log("This is the end.");

// const axiosConfig: AxiosRequestConfig = {
//   headers: {"Content-Type": "application/json"}
// }

// axios.post('/server/generate_link_token')
// .then(function (response) {
//   console.log(JSON.stringify(response, undefined, 2));
// })
// .catch(function (error) {
//   console.log(error);
// });


// const initializeLink = async function () {
//   linkTokenData = await callMyServer("/server/generate_link_token", true);
//   showOutput(`Received link token data ${JSON.stringify(linkTokenData)}`);
//   if (linkTokenData != null) {
//     document.querySelector("#startLink").removeAttribute("disabled");
//   }
// };



// const callMyServer = async function (
//   endpoint: any,
//   isPost = false,
//   postData = null
// ) {
//   const optionsObj: any = isPost ? { method: "POST" } : {};
//   if (isPost && postData !== null) {
//     optionsObj.headers = { "Content-type": "application/json" };
//     optionsObj.body = JSON.stringify(postData);
//   }
//   const response = await fetch(endpoint, optionsObj);
//   if (response.status === 500) {
//     await handleServerError(response);
//     return;
//   }
//   const data = await response.json();
//   console.log(`Result from calling ${endpoint}: ${JSON.stringify(data)}`);
//   return data;
// }