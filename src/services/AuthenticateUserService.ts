import axios from 'axios';
import { sign } from 'jsonwebtoken';
import 'dotenv/config';

import prismaClient from '../prisma';

/**
 * Receive code (string)
 * Get access_token from github
 * Check if user exists on DB
 * if TRUE ===> CREATE TOKEN
 * if FALSE ===> CREATE USER ON DB, CREATE TOKEN
 * Return token with user info
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserInfoResponse {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

export class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      });

    const response = await axios.get<IUserInfoResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: { github_id: id },
    });

    if (!user)
      user = await prismaClient.user.create({
        data: { github_id: id, login, name: name || login, avatar_url },
      });

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET as string,
      { subject: user.id, expiresIn: '1d' }
    );

    return { token, user };
  }
}
