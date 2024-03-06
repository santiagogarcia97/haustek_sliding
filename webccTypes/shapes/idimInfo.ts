export interface IDimInfo {
  dimShow: boolean;
  name: string;
  value: number;
  obj: object;
  applyDiff(value: number): void;
}
