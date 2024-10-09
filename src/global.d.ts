export {};

declare global {
    var uploadProgress: number
    interface Global {
      myGlobalFunction: () => void;
    }
  
   export interface globalThis extends Global {}
  }