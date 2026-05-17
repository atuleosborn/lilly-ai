/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let tokenClient: any;
let authInitialized = false;
let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;
let inFlightRequest: any = null;

export const initAuth = (clientId: string, onGsiLoaded?: () => void) => {
  if (authInitialized) return;

  const script = document.createElement('script');
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    const googleObj = (window as any).google;
    if (!googleObj) return;

    tokenClient = googleObj.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: (response: any) => {
        if (!inFlightRequest) return;
        const { resolve, reject } = inFlightRequest;
        inFlightRequest = null;

        if (response.error !== undefined) {
          reject(response);
        } else {
          cachedAccessToken = response.access_token;
          const expiresIn = response.expires_in ? parseInt(response.expires_in, 10) : 3600;
          tokenExpiryTime = Date.now() + expiresIn * 1000;
          resolve(response.access_token);
        }
      },
    });
    authInitialized = true;
    if (onGsiLoaded) onGsiLoaded();
  };
  document.head.appendChild(script);
};

export const getAccessToken = async (interactive = false): Promise<string> => {
  if (!tokenClient) {
    throw new Error('Auth not initialized');
  }

  if (cachedAccessToken && tokenExpiryTime && (tokenExpiryTime - Date.now() > 60000)) {
    return cachedAccessToken;
  }

  if (inFlightRequest) return inFlightRequest.promise;

  let resolveFn: any;
  let rejectFn: any;
  const promise = new Promise<string>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  inFlightRequest = { promise, resolve: resolveFn, reject: rejectFn };
  tokenClient.requestAccessToken(interactive ? {} : { prompt: 'none' });

  return promise;
};
