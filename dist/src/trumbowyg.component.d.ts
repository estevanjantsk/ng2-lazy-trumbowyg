import { ElementRef, OnDestroy, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from "rxjs";
import { TrumbowygService } from "./trumbowyg.service";
export declare class Trumbowyg implements OnInit, OnDestroy, OnChanges {
    private el;
    private trumbowygService;
    /**
     * @deprecated use 'update' for a preview
     */
    togglePreview: boolean;
    initialContent: string;
    liveUpdate: boolean;
    update: Observable<any>;
    options: any;
    savedContent: EventEmitter<any>;
    private loaded$;
    private readyToUse$;
    private content$;
    private contentSub;
    private updateSubscription;
    private trumbowygEl;
    constructor(el: ElementRef, trumbowygService: TrumbowygService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
