/// <reference path="read-file.d.ts" />

import {Injectable} from "@angular/core";
import { read } from "read-file"; 

declare let document: any;

@Injectable()
export class LoadExternalFiles {

  constructor() {}

  public load(...paths: string[]) {
    let promises = paths.reduce((promiseArr: Array<Promise<any>>, path: string) => [...promiseArr, this.loadFile(path)], []);
    return Promise.all(promises);
  }

  private loadFile(path: string) {

    return new Promise((resolve, reject) => {
      let e: any;
      if (/(^css!|\.css$)/.test(path)) {
        // css
        e = document.createElement('link');
        e.rel = 'stylesheet';
        e.href = path.replace(/^css!/, '');  // remove "css!" prefix
      } else {
        // javascript
        e = document.createElement('script');
        e.src = path;
        e.async = true;
      }
      document.getElementsByTagName('head')[0].appendChild(e);

      e.onload = () => {
        resolve();
      };
      e.onerror = (err: any) => reject(new Error("Files not found."));
    });
  }

  public createUploadS3(): Promise<string> {
    console.log("caiu");
    
    const uploads3 = read.sync('plugins/uploads3/trumbowyg.uploads3.js', 'utf8');
    let e: any;
    return new Promise((resolve, reject) => {
      // javascript
      e = document.createElement('script');
      e.type = 'text/javascript';
      e.text = uploads3;
      e.async = true;
      document.getElementsByTagName('head')[0].appendChild(e);

      e.onload = () => {
        resolve();
      };
      e.onerror = (err: any) => reject(new Error("uploads3 not found."));
    });
  }
}