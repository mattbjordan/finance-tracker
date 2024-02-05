"use client";

import React, { useCallback, useState } from 'react';

import { usePlaidLink, PlaidLinkOnSuccess } from 'react-plaid-link';

import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import dotenv from 'dotenv';



const SimplePlaidLink = () => {
  const [token, setToken] = useState<string | null>(null);

  // get link_token from your server when component mounts
  React.useEffect(() => {
    const createLinkToken = async () => {
      // dotenv.config();

      // // Set up the Plaid client
      // const configuration = new Configuration({
      //   basePath: PlaidEnvironments.sandbox,
      //   baseOptions: {
      //     headers: {
      //       "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      //       "PLAID-SECRET": process.env.PLAID_SECRET,
      //       "Plaid-Version": "2020-09-14",
      //     },
      //   },
      // });

      // const client = new PlaidApi(configuration);

      // const linkTokenConfig: LinkTokenCreateRequest = {
      //   user: { client_user_id: process.env.CLIENT_ID! },
      //   client_name: "Plaid Tutorial",
      //   language: "en",
      //   products: [Products.Auth],
      //   country_codes: [CountryCode.Us],
      //   webhook: "https://www.example.com/webhook",
      // };
      // // const tokenResponse = await client.linkTokenCreate(linkTokenConfig);
      // const tokenData = tokenResponse.data;
      // res.json(tokenData);

      const response = await fetch('/api/create_link_token', { method: 'POST' });
      const { link_token } = await response.json();
      // const response = await client.linkTokenCreate(linkTokenConfig);
      // const { link_token } = response.data;

      setToken(link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    console.log(publicToken, metadata);
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
    // onEvent
    // onExit
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default SimplePlaidLink;