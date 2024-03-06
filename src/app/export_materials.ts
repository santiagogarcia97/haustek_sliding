import { Webcc } from "./types";

export interface DrawingComponent {
  id: number,
  windowId: number,
  type: 'connector' | 'windowComponent',
  description: string,
  orientation: string,
  medidas: string
  height: number,
  width: number,
  angulosCorte: string,
  object: any,
}

export const exportMaterials = (webcc: Webcc, logConsole: boolean = true): DrawingComponent[] => {
  //console.log(this.webcc.shapeManager.toNoDimData());

  /// Listado de componentes que componen las figuras dibujadas
  const components: DrawingComponent[] = [];

  if (logConsole) console.log(webcc.dimManager.visualIDimInfos);

  /// Parseo los conectores
  webcc.shapeManager.couples.forEach((couple) => {
    components.push(parseConnector(couple));
  });

  /// Array de todos los children que componen las figuras
  const children: any[] = [];
  webcc.shapeManager.shapem.forEach((frame) => children.push(...flatChildren(frame.children)));

  // const bars: any[] = [];
  // children.filter(c => c.type === 'Bar').forEach((child) => {
  //   bars.push(child);
  // });
  // console.table(bars);

  /// Parseo los componentes de las ventanas

  children.forEach((child) => {
    if (child.type === 'Bar') {
      const component = parseBar(child);
      if (component) {
        components.push(component);
      }
    }

    if (child.type === 'Glass') {
      components.push(parseGlass(child));
    }
  });

  components.sort((a, b) => a.description.includes('MARCO FIJO') ? 1 : a.description.includes('Vidrio') ? -1 : 0);

  if (logConsole) console.table(components);

  return components;
};


/// Descompone los hijos de un elemento en un array, funcion recursiva
export const flatChildren = (children: any[]): any[] => {
  const result: any[] = [];

  children.forEach((child) => {
    result.push(child);

    if (child.children?.length > 0) {
      result.push(...flatChildren(child.children));
    }
  });

  return result;
}


const parseBar = (bar: any): DrawingComponent | null => {
  if (bar.polygon.virtual) return null;

  if (bar.parent.type === 'Bead') return parseBeadBar(bar);
  if (bar.parent.type === 'Frame') return parseFrameBar(bar);
  if (bar.parent.type === 'Sash') return parseSashBar(bar);

  return null;
}

const parseGlass = (glass: any): DrawingComponent => {
  return {
    id: glass.id,
    windowId: glass.topFrame.id,
    type: 'windowComponent',
    description: 'Vidrio ' + glass.serial?.text,
    medidas:
      Math.round(glass.polygon.box.xmax - glass.polygon.box.xmin) +
      ' x ' +
      Math.round(glass.polygon.box.ymax - glass.polygon.box.ymin),
    height: glass.polygon.box.ymax - glass.polygon.box.ymin,
    width: glass.polygon.box.xmax - glass.polygon.box.xmin,
    angulosCorte: '',
    object: glass,
    orientation: '',
  };
}

const parseConnector = (connector: any): DrawingComponent => {
  return {
    id: connector.id,
    windowId: connector.parent.id,
    type: 'connector',
    description: 'Conector',
    medidas:
      Math.round(connector.polygon.mulShape.length) +
      ' x ' +
      Math.round(connector.size),
    height: connector.size,
    width: connector.polygon.mulShape.length,
    angulosCorte: connector.cutAngle.split('-').map((angle: string) => angle + 'º').join(' '),
    object: connector,
    orientation: '',
  };
}

const parseBeadBar = (beadBar: any): DrawingComponent => {
  return {
    id: beadBar.id,
    windowId: beadBar.topFrame.id,
    description: 'Junquillo' + ' ' + beadBar.parent.parent.serial.text,
    type: 'windowComponent',
    medidas: Math.round(beadBar.polygon.mulShape.length) + ' x ' + Math.round(beadBar.width),
    height: beadBar.polygon.mulShape.length,
    orientation: getBarOrientation(beadBar),
    width: beadBar.width,
    angulosCorte: beadBar.cutAngle.split('-').map((angle: string) => angle + 'º').join(' '),
    object: beadBar,
  };
};

const parseFrameBar = (frameBar: any): DrawingComponent => {
  return {
    id: frameBar.id,
    windowId: frameBar.topFrame.id,
    description: frameBar.where === 'Frame' ? 'MarcoFijo' : 'DivisorMarco',
    type: 'windowComponent',
    medidas: Math.round(frameBar.polygon.mulShape.length) + ' x ' + Math.round(frameBar.width),
    height: frameBar.polygon.mulShape.length,
    orientation: getBarOrientation(frameBar),
    width: frameBar.width,
    angulosCorte: frameBar.cutAngle.split('-').map((angle: string) => angle + 'º').join(' '),
    object: frameBar,
  };

}

const parseSashBar = (sashBar: any): DrawingComponent => {
  return {
    id: sashBar.id,
    windowId: sashBar.topFrame.id,
    description: (sashBar.where === 'Sash' ? 'Hoja' : 'DivisorHoja') + ' ' + ((sashBar.parent.sashNumber > 0) ? sashBar.parent.sashNumber : ''),
    type: 'windowComponent',
    medidas: Math.round(sashBar.polygon.mulShape.length) + ' x ' + Math.round(sashBar.width),
    height: sashBar.polygon.mulShape.length,
    orientation: getBarOrientation(sashBar),
    width: sashBar.width,
    angulosCorte: sashBar.cutAngle.split('-').map((angle: string) => angle + 'º').join(' '),
    object: sashBar,
  };
}


interface Coordinate {
  x: number;
  y: number;
}



const getBarOrientation = (bar: any): 'H' | 'V' | '' => {
  if (!bar.sideEdgesWithDirection) return '';

  const directions = bar.sideEdgesWithDirection.map((edge: any) => edge.direction);

  if (directions.includes('left') && directions.includes('right')) return 'V';
  if (directions.includes('down') && directions.includes('up')) return 'H';

  return '';
};
