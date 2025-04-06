import { CommunicationService } from "./communication.service";

export interface RemoteState {
    index: number;
    name: string;
    isEnabled: boolean;
    serial: string;
    bitmask: string;
}

export class Remote implements RemoteState {
    private _index: number;
    private _name: string = "";
    private _isEnabled: boolean = false;
    private _bitmask: string = "";
    private _serial: string = "";

    constructor(private comm: CommunicationService, index: number) {
        this._index = index;
    }

    public get index(): number {
        return this._index;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get isEnabled(): boolean {
        return this._isEnabled;
    }
    public set isEnabled(value: boolean) {
        this._isEnabled = value;
    }

    public get bitmask(): string {
        return this._bitmask;
    }
    public set bitmask(value: string) {
        this._bitmask = value;
    }

    public get serial(): string {
        return this._serial;
    }
    public set serial(v: string) {
        this._serial = v;
    }
}