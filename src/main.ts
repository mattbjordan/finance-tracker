import axios, { AxiosRequestConfig } from 'axios';
import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';

// global.document = new JSDOM(html).window.document;
// global.document = new JSDOM().window.document;
global.document = (await JSDOM.fromFile("./public/index.html")).window.document;

console.log("Hello World.");

// const element = document.getElementById("hello-world");
// if (element) {
//   element.textContent = "Hello, World! This site uses Typescript!";
// }

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

const linkTokenData = tokenData;

//@ts-ignore
const handler = Plaid.create({
  token: linkTokenData.link_token,
  //@ts-ignore
  onSuccess: async (publicToken, metadata) => {
    console.log(`ONSUCCESS: Metadata ${JSON.stringify(metadata)}`);
    console.log(
      `I have a public token: ${publicToken} I should exchange this`
    );
    let publicTokenToExchange = publicToken;
    //@ts-ignore
    document.querySelector("#exchangeToken").removeAttribute("disabled");
  },
  //@ts-ignore
  onExit: (err, metadata) => {
    console.log(
      `Exited early. Error: ${JSON.stringify(err)} Metadata: ${JSON.stringify(
        metadata
      )}`
    );
    console.log(`Link exited early with status ${metadata.status}`)
  },
  //@ts-ignore
  onEvent: (eventName, metadata) => {
    console.log(`Event ${eventName}, Metadata: ${JSON.stringify(metadata)}`);
  },
});
handler.open();



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