export declare class CcBar {
  getDrawingInfo(): {
    frameId: number;
    variables: (
      | {
          name: string;
          value: string;
        }
      | {
          name: string;
          value: number;
        }
    )[];
  }[];
  getCcBars(): any[];
  getSashCcBars(sashDataArr: any[]): any[];
  getInnerSashCcBars(sashDataArr: any[]): any[];
}
