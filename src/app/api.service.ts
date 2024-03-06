import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Webcc } from './types';

/// Definicion de types
///
enum ProfilePosition {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  NO_POSITION = '',
}

export interface FrameJson {
  model: string;
  color: string;
  frames: FrameProfileJson[];
  sashes: SashProfileJson[];
  glasses: GlassJson[];
}

interface FrameProfileJson {
  position: ProfilePosition;
  type: 'frame';
  long: number;
  is_div: boolean;
  angles: number[];
}

interface SashProfileJson {
  position: ProfilePosition;
  type: 'sash';
  long: number;
  is_div: boolean;
  angles: number[];
}

interface GlassJson {
  desc: string;
  width: number;
  height: number;
  thickness: number;
  beadings: GlassBeadingJson[];
}

interface GlassBeadingJson {
  position: ProfilePosition;
  long: number;
}

////
/// Fin definicion de types



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  getMaterials(webcc: Webcc) {
    return this.http.post(
      'http://localhost:8080/api/v1/break-down',
      { windows: JSON.stringify(exportJsonApi(webcc)) },
    );
  }

}




// This function exports the drawing to a JSON file
export const exportJsonApi = (webcc: Webcc): FrameJson[] => {
  const json: FrameJson[] = [];

  /// Por cada Frame del dibujo
  webcc.shapeManager.shapem.forEach((frame) => {
    const flattenChildren = flatChildren(frame.children);

    // Create a new FrameJson object for the current frame
    const frameJson: FrameJson = {
      model: frame.serial.text,
      color: 'BLANCO',
      frames: flattenChildren.filter(c => c.type === 'Bar' && (c.where === 'Frame' || c.where === 'FrameMullion'))
        .filter(bar => !bar.polygon.virtual)
        .filter(bar => !(bar.where ==='FrameMullion' && bar.width === 6)) /// Descarto el poste inversor
        .map((frameBar) => parseFrameBar(frameBar)),
      sashes: flattenChildren.filter(c => c.type === 'Bar' && (c.where === 'Sash' || c.where === 'SashMullion'))
        .map((frameBar) => parseSashBar(frameBar)),
      glasses: flattenChildren.filter(c => c.type === 'Glass')
        .map((glass) => parseGlass(glass)),
    };

    json.push(frameJson);
  });

  console.log(json);
  return json;
};


/// Parsea un perfil que compone el marco, puede ser un divisor
const parseFrameBar = (frameBar: any): FrameProfileJson => {
  return {
    position: getBarOrientation(frameBar),
    type: "frame",
    long: Math.ceil(frameBar.polygon.mulShape.length),
    is_div: frameBar.where !== 'Frame',
    angles: frameBar.cutAngle.split('-').map((angle: string) => Math.ceil(parseInt(angle.trim()))),
  };
}

/// Parsea los perfiles que componen una hoja, puede ser un divisor
const parseSashBar = (sashBar: any): SashProfileJson => {
  return {
    position: getBarOrientation(sashBar),
    type: "sash",
    long: Math.ceil(sashBar.polygon.mulShape.length),
    is_div: sashBar.where !== 'Sash',
    angles: sashBar.cutAngle.split('-').map((angle: string) => Math.ceil(parseInt(angle.trim()))),
  };
}

/// Parsea junquillos
const parseBeadBar = (beadBar: any): GlassBeadingJson => {
  return {
    position: getBarOrientation(beadBar),
    long: Math.ceil(beadBar.polygon.mulShape.length),
  };
}

/// Parsea un vidrio
const parseGlass = (glass: any): GlassJson => {
  return {
    desc: glass.serial.text,
    width: Math.ceil(glass.polygon.box.xmax - glass.polygon.box.xmin),
    height: Math.ceil(glass.polygon.box.ymax - glass.polygon.box.ymin),
    thickness: 22,
    beadings: glass.bead.children.map((bead: any) => parseBeadBar(bead)),
  };
}

/// Devuelve la orientacion de un perfil, si es horizontal o vertical
const getBarOrientation = (bar: any): ProfilePosition => {
  if (!bar.sideEdgesWithDirection) throw new Error('Bar has no sideEdgesWithDirection');

  const directions = bar.sideEdgesWithDirection.map((edge: any) => edge.direction);

  if (directions.includes('left') && directions.includes('right')) return ProfilePosition.VERTICAL;
  if (directions.includes('down') && directions.includes('up')) return ProfilePosition.HORIZONTAL;

  return ProfilePosition.NO_POSITION;
};

/// Descompone los hijos de un elemento en un array, funcion recursiva
const flatChildren = (children: any[]): any[] => {
  const result: any[] = [];

  children.forEach((child) => {
    result.push(child);

    if (child.children?.length > 0) {
      result.push(...flatChildren(child.children));
    }
  });

  return result;
};