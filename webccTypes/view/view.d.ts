import Bus from 'rxjs-event-bus';
import { ToolManager } from '../tools';
import { MometoManager } from '.';
import { ShapeManager, IDimInfoManager } from '../shapes/managers';
export declare class View {
  eventBus: Bus<any>;
  toolManager: ToolManager;
  shapeManager: ShapeManager;
  mometoManager: MometoManager;
  dimManager: IDimInfoManager;
  readonly isDragging: boolean;
  serialize(): string;
  deserialize(cp: string): void;
  refresh(): void;
  destoryAll(): void;
  changeMode(): void;
}
