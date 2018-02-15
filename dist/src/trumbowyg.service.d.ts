import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { TrumbowygConfig } from "./trumbowyg.config";
import { LoadExternalFiles } from "./load-external-file.service";
export declare class TrumbowygService {
    private loadFiles;
    private TRUMBOWYG_PREFIX_URL;
    private TRUMBOWYG_PLUGINS_PREFIX;
    private TRUMBOWYG_STYLES_URL;
    private TRUMBOWYG_SCRIPT_URL;
    private isLoaded$;
    private loadedLangs;
    private config;
    constructor(loadFiles: LoadExternalFiles, config: TrumbowygConfig);
    load(serverPath: string): void;
    private parsePlugins(config, serverPath);
    private loadLang(lang);
    loaded(lang?: string): Observable<boolean>;
}
