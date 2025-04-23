declare module "pdf-parse" {
  import { Buffer } from "buffer";
  function pdf(dataBuffer: Buffer): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }>;
  export = pdf;
}
