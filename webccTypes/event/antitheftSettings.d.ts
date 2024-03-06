import { AntiTheft } from '../shapes';
import { ShutterOrientation } from '../shapes/managers';
export declare class AntiTheftSettings {
  readonly target: AntiTheft;
  gap: number;
  handleW: number;
  hasOffset: boolean;
  orientation: ShutterOrientation;
}
