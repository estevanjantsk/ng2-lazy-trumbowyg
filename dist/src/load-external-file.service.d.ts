/// <reference path="../../src/read-file.d.ts" />
export declare class LoadExternalFiles {
    constructor();
    load(...paths: string[]): Promise<any[]>;
    private loadFile(path);
}
