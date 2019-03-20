export declare class LoadExternalFiles {
    constructor();
    load(...paths: string[]): Promise<any[]>;
    private loadFile;
}
