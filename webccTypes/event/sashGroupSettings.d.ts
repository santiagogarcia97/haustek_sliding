import {
  SashSettings,
  SlideSettings,
  AntiTheftSettings,
  DoubleSashSettings,
  FoldSashSettings,
  KfcSashSettings,
  DoubleKfcSashSettings,
} from '.';
export declare class SashGroupSettings {
  readonly settings: Array<
    | SashSettings
    | KfcSashSettings
    | DoubleKfcSashSettings
    | AntiTheftSettings
    | DoubleSashSettings
    | FoldSashSettings
    | SlideSettings
  >;
  activeIndex: number;
}
