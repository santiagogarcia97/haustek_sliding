import Bus from 'rxjs-event-bus';

export interface Coordinate {
  x: number;
  y: number;
}
export declare interface Webcc {
  /** Bus de eventos. */
  eventBus: Bus<any>;
  /** Herramientas. */
  toolManager: ToolManager;
  /** Toddo lo referido al dibujo acual, funciones para importar y exportar. */
  shapeManager: ShapeManager;
  /** Patron Memento, funciones de deshacer, rehacer, etc.   */
  mometoManager: MometoManager;
  /** Los Dims son las lineas azules que aparecen para marcar el largo de un segmento. */
  dimManager: IDimInfoManager;
  /** Para seleccionar el lenguaje. */
  langMode: string;
  activeLayer: any;
  readonly isDragging: boolean;
  serialize(): string;
  deserialize(cp: string): void;
  refresh(): void;
  destoryAll(): void;
  changeMode(): void;
  setCanvasScale(newScaleX?: number, newScaleY?: number, positionX?: number, positionY?: number): void;
}

export declare class ToolManager {
  readonly currentToolText: ToolType;
  mousePosition: Coordinate;
  /** Para cambiar la herramienta seleccionado usando el teclado. */
  handleKey(key: string): void;
  /** Cambiar la herramienta seleccionada */
  takeTool(tool: ToolType, triggeredByShortKey?: boolean): void;
  tools: any[];
}
export declare enum ToolType {
  /** Si se sellecciona 'none' tira error, usar 'pan' como herramienta por defecto */
  none = 'none',
  pan = 'pan',
  wall = 'wall',
  frame_rectangle = 'frame_rectangle',
  frame_circle = 'frame_circle',
  frame_polygon = 'frame_polygon',
  frame_triangle = 'frame_triangle',
  frame_half_circle = 'frame_half_circle',
  frame_quarter_circle = 'frame_quarter_circle',
  frame_gothic = 'frame_gothic',
  frame_octagon = 'frame_octagon',
  frame_springline = 'frame_springline',
  frame_springline_flanker = 'frame_springline_flanker',
  frame_isosceles_triangle = 'frame_isosceles_triangle',
  frame_hexagon = 'frame_hexagon',
  frame_parallelogram = 'frame_parallelogram',
  frame_diamond = 'frame_diamond',
  frame_trapezoid = 'frame_trapezoid',
  frame_peak_pentagon = 'frame_peak_pentagon',
  frame_angled_pentagon = 'frame_angled_pentagon',
  frame_hollow_side = 'frame_hollow_side',
  frame_hollow = 'frame_hollow',
  frame_convex = 'frame_convex',
  frame_quarter_arch = 'frame_quarter_arch',
  frame_extended_partial_arch = 'frame_extended_partial_arch',
  frame_quatrefoil = 'frame_quatrefoil',
  frame_three_dimensional_arc = 'frame_three_dimensional_arc',
  frame_ear = 'frame_ear',
  frame_double_ears = 'frame_double_ears',
  frame_single_track = 'frame_single_track',
  frame_kfc = 'frame_kfc',
  frame_kfc2 = 'frame_kfc2',
  frame_wave = 'frame_wave',
  frame_onion = 'frame_onion',
  frame_mosque = 'frame_mosque',
  mullion_horizontal = 'mullion_horizontal',
  mullion_vertical = 'mullion_vertical',
  mullion_diagnoal = 'mullion_diagnoal',
  mullion_counterdiagnoal = 'mullion_counterdiagnoal',
  mullion_spin = 'mullion_spin',
  mullion_compound_square = 'mullion_compound_square',
  mullion_compound_diamond = 'mullion_compound_diamond',
  mullion_compound_circle = 'mullion_compound_circle',
  mullion_compound_hexagon = 'mullion_compound_hexagon',
  mullion_compound_x_square = 'mullion_compound_x_square',
  mullion_inner_arc = 'mullion_inner_arc',
  mullion_half_hexagon = 'mullion_half_hexagon',
  mullion_compound_rectangle_single = 'mullion_compound_rectangle_single',
  mullion_compound_rectangle_double = 'mullion_compound_rectangle_double',
  mullion_compound_long_octagon = 'mullion_compound_long_octagon',
  mullion_compound_double_octagon = 'mullion_compound_double_octagon',
  mullion_wave = 'mullion_wave',
  editSplitter = 'editSplitter',
  editInnerSplitter = 'editInnerSplitter',
  editDragRobot = 'editDragRobot',
  editWallDragRobot = 'editWallDragRobot',
  editTopViewDragRobot = 'editTopViewDragRobot',
  editEdgeRobot = 'editEdgeRobot',
  editWallEdgeRobot = 'editWallEdgeRobot',
  editMullionRobot = 'editMullionRobot',
  editDoubleSashSpliterRobot = 'editDoubleSashSpliterRobot',
  sash = 'sash',
  kfcSash = 'kfcSash',
  doubleKfcSash = 'doubleKfcSash',
  doubleSash = 'doubleSash',
  screen = 'screen',
  doubleScreen = 'doubleScreen',
  antiTheft = 'antiTheft',
  editDim = 'editDim',
  editDimension = 'editDimension',
  editExtraDim = 'editExtraDim',
  extraDimArbitrary = 'extraDimArbitrary',
  extraDimHorizontal = 'extraDimHorizontal',
  extraDimVertical = 'extraDimVertical',
  extraDimRadius = 'extraDimRadius',
  extraDimAngle = 'extraDimAngle',
  editNote = 'editNote',
  editSash = 'editSash',
  editHinge = 'editHinge',
  editHandle = 'editHandle',
  editHardware = 'editHardware',
  editHardwareOnFrame = 'editHardwareOnFrame',
  editHardwareOnMullion = 'editHardwareOnMullion',
  editCommercialHandle = 'editCommercialHandle',
  editCrossHandle = 'editCrossHandle',
  foldSash = 'foldSash',
  foldScreen = 'foldScreen',
  slide = 'slide',
  dim = 'dim',
  editCornerRobot = 'editCornerRobot',
  connerJoiner = 'connerJoiner',
  editCornerJoiner = 'editCornerJoiner',
  note = 'note',
  connector = 'connector',
  editConnector = 'editConnector',
  editConnectorRobot = 'editConnectorRobot',
  /** 'Door' es un marco fijo con el perfil inferior oculto */
  door = 'door',
  editSkewText = 'editSkewText',
}

export declare class MometoManager {
  readonly isDirty: boolean;
  /** Undo last action. */
  undo(): void;
  /** Redo last action. */
  redo(): void;
  checkPoint(remember?: boolean): void;
  /** Borrar todo */
  clean(): void;
}

export enum dimModeEnum {
  normal = 'normal',
  calculate = 'calculate',
  order = 'order',
}
export declare class IDimInfoManager {
  initDimName(): void;
  updateDimByName(name: string, value: number): void;
  readonly visualIDimInfos: IDimInfo[];
}

export interface IDimInfo {
  dimShow: boolean;
  name: string;
  value: number;
  obj: object;
  applyDiff(value: number): void;
}

export declare class ShapeManager {
  readonly isDirty: boolean;
  /** Area total en metros cuadrados */
  readonly area: number;
  /** Altura total en milimetros */
  readonly height: number;
  /** Largo total en milimetros */
  readonly width: number;
  readonly isEmpty: boolean;
  readonly ccBar: any;
  /** Bloquear edicion */
  readonly: boolean;
  totalHeightShown: boolean;
  totalWidthShown: boolean;
  shapeMode: dimModeEnum;
  darkMode: boolean;
  preventScale: boolean;
  asSimpleView: boolean;
  enLangMode: boolean;
  profileSize: ProfileSizeSettings;
  barNormal: string | HTMLImageElement;
  handleColor: string;

  displayGlassSpec: boolean;
  areaSerials: any;
  /** Seteando esto en true hace que cuando una hoja sea marcada como fixed, la hoja se oculte (el vidrio se agarra al marco como en la Andes Monoriel) */
  fixedSashToFixedGlass: boolean;

  /** Cambia la notacion de apertura de los sashes */
  europeanStandard: boolean;
  windowStrokeColor: string;
  dragModifyOnHardware: boolean;
  /** Conectores */
  couples: any[];
  /** Marcos */
  shapem: any[];
  dimFontSize: number;
  dragModifyOnFrame: boolean;
  addFrame(linePath: any[]): void;
  openFile(data: string, remember?: boolean, x?: boolean): void;
  /** Hacer click en un elemento */
  hitBar(point: Coordinate, b: boolean): void;
  moveShapeToCenter(dstContainer?: HTMLElement): void;
  toData(): string | undefined;
  toSimpleData(): string | undefined;
  toNoDimData(): string | undefined;
  toData2d(): string;
  toDataCC(): string;
  setFrameSize(width: number, height: number): void;
  exportJson(): void;
  export(name?: string): void;
  export3dJson(asFile?: boolean): string | void;
  remove(): void;
  clear(refresh?: boolean): void;

  /** Exportar canvas a json */
  serialize(): string;
  /** Redibuja los poligonos */
  updatePoly(): void

  refreshDimStatus(): void;
}

export interface ProfileSizeSettings {
  /**Junquillo */
  bead?: number;
  /** Marco externo */
  frame?: number;
  /** Divisiones internas */
  frameMullion?: number;

  /** Hoja interna */
  sashMullion?: number;
  /** Hoja interna */
  sash?: number;
  /** Hoja interna */
  interlock?: number;
  /** Hoja interna */
  downSash?: number;
  /** Hoja interna */
  upSash?: number;


  antiTheft?: number;
  antiTheftMullion?: number;
  glassGap?: number;
  kfcWaist?: number;
  millingFrame?: number;
  millingSash?: number;
  reinforcedFrameMullion?: number;
  screen?: number;
  shadeMullion?: number;
  shadeSash?: number;
  shadeSashMullion?: number;
}



export declare class SashGroupSettings {
  readonly settings: Array<
    | SashSettings
    // | KfcSashSettings
    // | DoubleKfcSashSettings
    // | AntiTheftSettings
    // | DoubleSashSettings
    // | FoldSashSettings
    | SlideSettings
  >;
  activeIndex: number;
}

export declare class SlideSettings {
  /** Angulo de corte de las uniones: Vertical/Horizontal/Diagonal */
  jointWay: EdgeJointWay;
  /** Tipo de slide, solo se puede elegir combinaciones de rieles y hojas de un listado predefinido de 153 opciones */
  appliedOptionIndex: number;
  crescentLockHidden: boolean;
  hasOffset: boolean;
}
export declare class SashSettings {
  readonly isPush: boolean;
  readonly isSlide: boolean;
  readonly isFold: boolean;
  readonly handleForFoldHidden: boolean;
  readonly remainingWidth: number;
  readonly handlePosition: any;
  opened: boolean;
  jointWay: EdgeJointWay;
  hasOffset: boolean;
  openDirection: OpenDirection;
  openToward: OpenToward;
  /** Hinge es la bisagra */
  hingeType: HardwareShape;
  /** Cantidad de bisagras */
  hingeCount: number;
  autoHingeOffsets: boolean;
  hingeOffsets: number[];
  /** Tipo de manija */
  handleType: HardwareShape;
  autoHandleOffset: boolean;
  handleOffset: number;
  handleHidden: boolean;
  dimToGroundHidden: boolean;
  isFixed: boolean;
  /** Si se setea en -1 va a tomar el espacio sobrante */
  width: number;
  lockOffset: number;
  slideLockHidden: boolean;
  crescentLockShown: number;
  slideHandleHidden: boolean;
  handleForFoldOffset: number;
  /** Permite mover el sash de forma libre */
  offvecEnabled: boolean;
}

export enum EdgeJointWay {
  Default = 0,
  Horizontal = 1,
  Vertical = 2,
  Diagonal = 3
}

export declare enum OpenDirection {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
  /** Oscilobatiente */
  Left_With_Up = 'left_with_up',
  /** Oscilobatiente */
  Right_With_Up = 'right_with_up',
  /** Oscilobatiente */
  Left_With_Down = 'left_with_down',
  /** Oscilobatiente */
  Right_With_Down = 'right_with_down',
  Custom = 'custom',
}

export declare enum OpenToward {
  Inward = 'inward',
  Outward = 'outward',
}

export enum HardwareShape {
  Hinge = 'Hinge',
  HingeOnCircle = 'HingeOnCircle',
  HingePro = 'HingePro',
  Handle = 'Handle',
  Handle2 = 'Handle2',
  CommercialHandle = 'CommercialHandle',
  CommercialHandle2 = 'CommercialHandle2',
  CommercialHandle3 = 'CommercialHandle3',
  CommercialHandle4 = 'CommercialHandle4',
  CommercialHandle5 = 'CommercialHandle5',
  CommercialHandle6 = 'CommercialHandle6',
  CommercialHandle7 = 'CommercialHandle7',
  CommercialHandle8 = 'CommercialHandle8',
  CommercialHandle9 = 'CommercialHandle9',
  CommercialHandle10 = 'CommercialHandle10',
  CommercialHandle11 = 'CommercialHandle11',
  CommercialHandle12 = 'CommercialHandle12',
  HandleForFold = 'HandleForFold',
  HandleForSlide = 'HandleForSlide',
  KfcHandle = 'KfcHandle',
  CrossHandle = 'CrossHandle',
  Lock = 'Lock',
  Lock2 = 'Lock2',
}