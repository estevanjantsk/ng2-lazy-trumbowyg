/// <reference path="read-file.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { read } from "read-file";
var LoadExternalFiles = /** @class */ (function () {
    function LoadExternalFiles() {
    }
    LoadExternalFiles.prototype.load = function () {
        var _this = this;
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var promises = paths.reduce(function (promiseArr, path) { return promiseArr.concat([_this.loadFile(path)]); }, []);
        return Promise.all(promises);
    };
    LoadExternalFiles.prototype.loadFile = function (path) {
        return new Promise(function (resolve, reject) {
            var e;
            if (/(^css!|\.css$)/.test(path)) {
                // css
                e = document.createElement('link');
                e.rel = 'stylesheet';
                e.href = path.replace(/^css!/, ''); // remove "css!" prefix
            }
            else {
                // javascript
                e = document.createElement('script');
                e.src = path;
                e.async = true;
            }
            document.getElementsByTagName('head')[0].appendChild(e);
            e.onload = function () {
                resolve();
            };
            e.onerror = function (err) { return reject(new Error("Files not found.")); };
        });
    };
    LoadExternalFiles.prototype.createUploadS3 = function () {
        var uploads3 = read.sync('plugins/uploads3/trumbowyg.uploads3.js', 'utf8');
        var e;
        return new Promise(function (resolve, reject) {
            // javascript
            e = document.createElement('script');
            e.type = 'text/javascript';
            e.text = uploads3;
            e.async = true;
            document.getElementsByTagName('head')[0].appendChild(e);
            e.onload = function () {
                resolve();
            };
            e.onerror = function (err) { return reject(new Error("uploads3 not found.")); };
        });
    };
    LoadExternalFiles = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], LoadExternalFiles);
    return LoadExternalFiles;
}());
export { LoadExternalFiles };
//# sourceMappingURL=load-external-file.service.js.map