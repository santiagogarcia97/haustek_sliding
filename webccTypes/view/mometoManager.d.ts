export declare class MometoManager {
  readonly isDirty: boolean;
  undo(): void;
  redo(): void;
  checkPoint(remember?: boolean): void;
  clean(): void;
}
