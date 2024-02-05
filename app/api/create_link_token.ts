import type { NextApiRequest, NextApiResponse } from 'next'
 

import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import dotenv from 'dotenv';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

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
  try {
    const tokenResponse = await client.linkTokenCreate(linkTokenConfig);
    // const tokenData = tokenResponse.data;
    // res.json(tokenData);
    res.status(200).json({ tokenResponse })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })

  }
}
  