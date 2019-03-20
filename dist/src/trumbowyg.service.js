var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Optional, Injectable } from "@angular/core";
import { from, of } from "rxjs";
import { publishReplay, switchMap, map, catchError, refCount } from "rxjs/operators";
import { TrumbowygConfig } from "./trumbowyg.config";
import { LoadExternalFiles } from "./load-external-file.service";
var JQUERY_SCRIPT_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';
var TrumbowygService = /** @class */ (function () {
    function TrumbowygService(loadFiles, config) {
        this.loadFiles = loadFiles;
        this.loadedLangs = [];
        this.TRUMBOWYG_PREFIX_URL = "https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/" + ((config && config.version) || '2.8.0');
        this.TRUMBOWYG_PLUGINS_PREFIX = this.TRUMBOWYG_PREFIX_URL + '/plugins';
        this.TRUMBOWYG_STYLES_URL = this.TRUMBOWYG_PREFIX_URL + '/ui/trumbowyg.min.css';
        this.TRUMBOWYG_SCRIPT_URL = this.TRUMBOWYG_PREFIX_URL + '/trumbowyg.min.js';
        this.config = config;
    }
    TrumbowygService.prototype.load = function (serverPath) {
        var _this = this;
        var _a;
        var trumbowygFiles = [this.TRUMBOWYG_STYLES_URL, this.TRUMBOWYG_SCRIPT_URL];
        var trumbowygPlugInFiles = this.parsePlugins(this.config, serverPath);
        var loadBasicFiles$ = window && window["jQuery"] && window["jQuery"]().on ?
            from((_a = this.loadFiles).load.apply(_a, trumbowygFiles))
            : from(this.loadFiles.load(JQUERY_SCRIPT_URL))
                .pipe(switchMap(function () {
                var _a;
                return from((_a = _this.loadFiles).load.apply(_a, trumbowygFiles));
            }));
        var loadFiles$ = loadBasicFiles$
            .pipe(switchMap(function () {
            var _a;
            return from((_a = _this.loadFiles).load.apply(_a, trumbowygPlugInFiles))
                .pipe(catchError(function (err) { return of(err); }));
        }));
        this.isLoaded$ = loadFiles$
            .pipe(map(function () { return true; }), publishReplay(1), refCount());
    };
    TrumbowygService.prototype.parsePlugins = function (config, serverPath) {
        var _this = this;
        if (!config || !Array.isArray(config.plugins)) {
            return [];
        }
        return config.plugins.reduce(function (acc, plugin) {
            if (plugin === 'uploads3' && serverPath !== '') {
                acc.push(serverPath);
            }
            else {
                acc.push(_this.TRUMBOWYG_PLUGINS_PREFIX + "/" + plugin + "/trumbowyg." + plugin + ".min.js");
            }
            if (plugin === 'emoji' || plugin === 'colors') { //emoji doesn't work yet.
                acc.push(_this.TRUMBOWYG_PLUGINS_PREFIX + "/" + plugin + "/ui/trumbowyg." + plugin + ".min.css");
            }
            return acc;
        }, []);
    };
    TrumbowygService.prototype.loadLang = function (lang) {
        var _this = this;
        if (this.loadedLangs.indexOf(lang) < 0)
            return from(this.loadFiles.load(this.TRUMBOWYG_PREFIX_URL + "/langs/" + lang + ".min.js")
                .then(function () {
                _this.loadedLangs.push(lang);
                return true;
            }));
        return from(Promise.resolve(true));
    };
    TrumbowygService.prototype.loaded = function (lang) {
        var _this = this;
        return this.isLoaded$
            .pipe(switchMap(function () {
            if (lang)
                return _this.loadLang(lang);
            else
                return of(true);
        }));
    };
    TrumbowygService = __decorate([
        Injectable(),
        __param(1, Optional()),
        __metadata("design:paramtypes", [LoadExternalFiles,
            TrumbowygConfig])
    ], TrumbowygService);
    return TrumbowygService;
}());
export { TrumbowygService };
;
//# sourceMappingURL=trumbowyg.service.js.map