import { EdgeJointWay } from '../common';
import { HardwareShape } from '../shapes';
import { OpenDirection, OpenToward } from '../shapes/managers';
export declare class KfcSashSettings {
  jointWay: EdgeJointWay;
  openDirection: OpenDirection;
  openToward: OpenToward;
  hasOffset: boolean;
  opened: boolean;
  handleType: HardwareShape;
  dimToGroundHidden: boolean;
}
