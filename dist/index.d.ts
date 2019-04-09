interface IPattern {
    [branch: string]: any;
}
declare const match: (value: string, pattern: IPattern) => any;
declare const matchArray: (value: any[], pattern: any[]) => any;
declare const lazyMatch: (pattern: IPattern) => (value: string) => any;
export { lazyMatch, matchArray };
export default match;
