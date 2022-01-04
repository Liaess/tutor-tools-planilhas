import * as fs from 'fs/promises';
import { google } from 'googleapis';

async function getOauth() {
  let credentials;
  try {
    credentials = JSON.parse(await fs.readFile('credentials.json'));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error in reading credentials', error);
  }

  // eslint-disable-next-line camelcase
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  // eslint-disable-next-line camelcase
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  return oAuth2Client;
}

export async function getLinkToken() {
  const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://spreadsheets.google.com/feeds'];
  const oAuth = await getOauth();
  const authUrl = oAuth.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return authUrl;
}

export async function getTokenGoogle(code) {
  const oAuth = await getOauth();
  try {
    const request = await (oAuth.getToken(code));
    return request.tokens;
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.log('Error in search token');
  }
}

export async function authorize(token) {
  const oAuth = await getOauth();

  oAuth.setCredentials(token);

  return oAuth;
}
