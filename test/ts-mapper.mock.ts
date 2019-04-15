export interface ISourceCommon {
    propA: string;
    propB: number;
    propC: string;
    propD: string;
}

export interface ISourceDiffer {
    propA: string;
    propB: number;
    propC: string;
    propD: string;
    propE: number;
}

export interface ITargetCommon {
    propA: string;
    propB: number;
    propC: Date;
    propD: boolean;
}

export class TargetCommon {
    public propA: string;
    public propB: number;
    public propC: Date;
    public propD: boolean;
}