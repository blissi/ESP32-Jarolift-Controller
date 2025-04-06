import { CommunicationService } from "./communication.service";

export interface ShutterState {
    index: number;
    name: string;
    isEnabled: boolean;
}

export class Shutter implements ShutterState {
    private _index: number;
    private _name: string = "";
    private _isEnabled: boolean = false;

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
}