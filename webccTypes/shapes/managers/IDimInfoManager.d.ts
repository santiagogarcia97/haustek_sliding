import { IDimInfo } from '../../shapes';
export declare enum dimModeEnum {
  normal = 'normal',
  calculate = 'calculate',
  order = 'order',
}
export declare class IDimInfoManager {
  initDimName(): void;
  updateDimByName(name: string, value: number): void;
  readonly visualIDimInfos: IDimInfo[];
}
