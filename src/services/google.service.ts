export {};
import * as googleAuth from "googleapis";
import { config } from "../config/envConfig";

interface GoogleTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}
export default class GoogleService {
  private static readonly CLIENT_ID = config.GOOGLE_CLIENT_ID;
  private static readonly CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET;
  private static readonly REDIRECT_URI = config.REDIRECT_URI;
  private static readonly SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  private readonly oauthClient;

  constructor() {
    this.oauthClient = new googleAuth.google.auth.OAuth2(
      GoogleService.CLIENT_ID,
      GoogleService.CLIENT_SECRET,
      GoogleService.REDIRECT_URI
    );
  }

  async handleOAuthRedirect(authCode): Promise<GoogleTokens> {
    const { tokens } = await this.oauthClient.getToken(authCode);
    return {
      idToken: tokens.id_token!,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
    };
  }

  async getUserData(idToken) {
    const data = await this.oauthClient.verifyIdToken({ idToken });
    return data.getPayload();
  }
}
