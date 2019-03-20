var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { Trumbowyg } from "./src/trumbowyg.component";
import { TrumbowygService } from "./src/trumbowyg.service";
import { TrumbowygConfig } from "./src/trumbowyg.config";
import { LoadExternalFiles } from "./src/load-external-file.service";
var TrumbowygModule = /** @class */ (function () {
    function TrumbowygModule() {
    }
    TrumbowygModule_1 = TrumbowygModule;
    TrumbowygModule.forRoot = function (config) {
        return {
            ngModule: TrumbowygModule_1,
            providers: [
                { provide: TrumbowygConfig, useValue: config }
            ]
        };
    };
    var TrumbowygModule_1;
    TrumbowygModule = TrumbowygModule_1 = __decorate([
        NgModule({
            imports: [],
            declarations: [Trumbowyg],
            providers: [LoadExternalFiles, TrumbowygService],
            exports: [Trumbowyg]
        })
    ], TrumbowygModule);
    return TrumbowygModule;
}());
export { TrumbowygModule };
//# sourceMappingURL=index.js.map