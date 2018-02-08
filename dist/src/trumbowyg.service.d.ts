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
    private PLUGIN_S3_URL;
    private isLoaded$;
    private loadedLangs;
    constructor(loadFiles: LoadExternalFiles, config: TrumbowygConfig);
    private parsePlugins(config);
    private loadLang(lang);
    loaded(lang?: string): Observable<boolean>;
}
