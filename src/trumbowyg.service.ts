import {Optional, Injectable} from "@angular/core";
import {Observable, from, of} from "rxjs";
import { publishReplay, switchMap, map, catchError, refCount } from "rxjs/operators";
import {TrumbowygConfig} from "./trumbowyg.config";
import {LoadExternalFiles} from "./load-external-file.service";

const JQUERY_SCRIPT_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';

declare const window: any;

@Injectable()
export class TrumbowygService {

  private TRUMBOWYG_PREFIX_URL: string;
  private TRUMBOWYG_PLUGINS_PREFIX: string;
  private TRUMBOWYG_STYLES_URL: string;
  private TRUMBOWYG_SCRIPT_URL: string;

  private isLoaded$: Observable<boolean>;
  private loadedLangs: Array<string> = [];
  private config: TrumbowygConfig;

  constructor(
    private loadFiles: LoadExternalFiles,
    @Optional() config: TrumbowygConfig
  ) {
    this.TRUMBOWYG_PREFIX_URL = `https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/${(config && config.version) || '2.8.0'}`;
    this.TRUMBOWYG_PLUGINS_PREFIX = this.TRUMBOWYG_PREFIX_URL + '/plugins';
    this.TRUMBOWYG_STYLES_URL = this.TRUMBOWYG_PREFIX_URL + '/ui/trumbowyg.min.css';
    this.TRUMBOWYG_SCRIPT_URL = this.TRUMBOWYG_PREFIX_URL + '/trumbowyg.min.js';
    this.config = config;
  }

  public load(serverPath: string) {
    const trumbowygFiles = [ this.TRUMBOWYG_STYLES_URL, this.TRUMBOWYG_SCRIPT_URL ];
    const trumbowygPlugInFiles = this.parsePlugins(this.config, serverPath);

    const loadBasicFiles$ = window && window["jQuery"] && window["jQuery"]().on ?
      from(this.loadFiles.load(...trumbowygFiles))
      : from(this.loadFiles.load(JQUERY_SCRIPT_URL))
        .pipe(
          switchMap(() =>
            from(this.loadFiles.load(...trumbowygFiles))
          )
        );
    const loadFiles$ = loadBasicFiles$
      .pipe(
        switchMap(() =>
          from(this.loadFiles.load(...trumbowygPlugInFiles))
            .pipe(catchError(err => of(err)))
        )
      );

    this.isLoaded$ = loadFiles$
      .pipe(
        map(() => true),
        publishReplay(1),
        refCount()
      );
  }

  private parsePlugins(config: TrumbowygConfig, serverPath: string): string[] {
    if (!config ||  !Array.isArray(config.plugins)) { return []; }

    return config.plugins.reduce(
      (acc: string[], plugin: string) => {
        if (plugin === 'uploads3' && serverPath !== '') {
          acc.push(serverPath)
        } else {
          acc.push(`${this.TRUMBOWYG_PLUGINS_PREFIX}/${plugin}/trumbowyg.${plugin}.min.js`);
        }
        if(plugin === 'emoji' || plugin === 'colors') { //emoji doesn't work yet.
          acc.push(`${this.TRUMBOWYG_PLUGINS_PREFIX}/${plugin}/ui/trumbowyg.${plugin}.min.css`);
        }
        return acc;
      }, []);
  }

  private loadLang(lang: string): Observable<any> {
    if(this.loadedLangs.indexOf(lang) < 0)
      return from(
        this.loadFiles.load(`${this.TRUMBOWYG_PREFIX_URL}/langs/${lang}.min.js`)
          .then(() => {
            this.loadedLangs.push(lang);
            return true;
          })
      );
    return from(Promise.resolve(true));
  }

  public loaded(lang?: string): Observable<boolean> {
    return this.isLoaded$
      .pipe(
        switchMap(() => {
          if(lang) return this.loadLang(lang);
          else return of(true);
        })
      )
  }
}
;