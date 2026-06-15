/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare global {
  interface Window {
    siteParams?: {
      blogapikey: string;
    };
  }
}

declare module '*.yaml?raw' {
  const content: string;
  export default content;
}

export {};
