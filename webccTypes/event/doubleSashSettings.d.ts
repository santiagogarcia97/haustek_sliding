import { OpenToward } from '../shapes/managers';
import { EdgeJointWay } from '../common';
import { DoubleSash, HardwareShape } from '../shapes';
export declare class DoubleSashSettings {
  readonly target: DoubleSash;
  jointWay: EdgeJointWay;
  opened: boolean;
  openToward: OpenToward;
  autoSplit: boolean;
  hingeCount: number;
  hingeType: HardwareShape;
  hasOffset: boolean;
}
