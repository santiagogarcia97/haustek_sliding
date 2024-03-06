import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as webcclib from 'webcc';
import { ToolType } from './tools';
import { DrawingComponent, exportMaterials, flatChildren } from './export_materials';
import { EdgeJointWay, HardwareShape, ProfileSizeSettings, SashGroupSettings, SashSettings, SlideSettings, Webcc, dimModeEnum } from './types';
import { andes_54, andes_66, andes_fijo_S38, andes_proyectante_S38, s60_marco_fijo, s60_puerta, s60_ventana, sliding_hoja_80, sliding_hoja_98, zenia } from './profile_sizes';
import { ApiService } from './api.service';
import { ventanas } from './ventanas';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  demoMode = environment.demoMode;


  downloadUpdated() {
    if (this.webcc && this.ventanaSeleccionada) {
      const json = JSON.stringify(JSON.parse(this.webcc!.shapeManager.serialize()), null, 2);
      const filename = this.ventanaSeleccionada.name;

      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }



  constructor(private _apiService: ApiService) { }

  webcc: Webcc | null = null;

  materials: DrawingComponent[] = [];

  /// Listado de herramientas para armar el dropdown
  tools: string[] = [];
  selectedTool = ToolType.pan;
  get toolType(): typeof ToolType {
    return ToolType;
  }

  mousePos = { x: 0, y: 0 };
  display = 2;


  /// Ventanas disponibles para importar
  ventanasDisponibles: { name: string; value: any }[] = ventanas;
  ventanaSeleccionada: { name: string; value: any } = this.ventanasDisponibles[0];


  /// Perfiles
  perfilesDisponibles: { name: string; value: string }[] = [
    { name: 'Zenia', value: JSON.stringify(zenia) },

    { name: 'Andes 66', value: JSON.stringify(andes_66) },
    { name: 'Andes 54', value: JSON.stringify(andes_54) },
    { name: 'Andes Fijo S38', value: JSON.stringify(andes_fijo_S38) },
    { name: 'Andes Proyectante S38', value: JSON.stringify(andes_proyectante_S38) },

    { name: 'Sliding Hoja80', value: JSON.stringify(sliding_hoja_80) },
    { name: 'Sliding Hoja98', value: JSON.stringify(sliding_hoja_98) },
    { name: 'S60 Marco Fijo', value: JSON.stringify(s60_marco_fijo) },
    { name: 'S60 Ventana', value: JSON.stringify(s60_ventana) },
    { name: 'S60 Puerta', value: JSON.stringify(s60_puerta) },
  ];
  perfilSeleccionado: string = this.perfilesDisponibles[0].value;


  /// Cuando se selecciona una ventana de tipo Slide aparece un menu arriba a la derecha para modificar sus propiedades
  /// por ahora solo puse para modificar el tipo de ventana. Son 153 veentanas predefinidas de las que se pueden elegir
  /// Se cambian seteando un index en el objeto slide, no estan documentados en ningun lado.
  slideTypes = [...Array(161).keys()];
  sashGroupSettings: SashGroupSettings | null = null;
  selectedSlideType = 0;

  jointWays = Object.values(EdgeJointWay);
  selectedJointWay = EdgeJointWay.Default;


  hardwareShapes = Object.values(HardwareShape);

  selectedHandleShape = HardwareShape.Handle;
  selectedHingeShape = HardwareShape.Hinge;


  ngOnInit() {
    addEventListener("error", (event) => {
      // if (typeof event === 'string' && event.includes("reading 'polygon'")) {
      //   alert(event);
      //   //this.selectTool(ToolType.pan);
      //   //this.undo();
      //   //this.redo();
      // }
      return false;
    });
  }



  ngAfterViewInit() {
    this.webcc = new webcclib.Runtime(
      'eyJuYW1lIjoiUmhpbm8iLCJzdG0iOjE2Njc0MzM2MDAwMDAsImV4cCI6MjY5OTA1NjAwMDAwMCwibGl0ZSI6ZmFsc2V9.36ea286852bd9ac503b4ff0ec0583784'
    );
    /*
        // set
        this.webcc!.shapeManager.profileSize = {
    
          antiTheft: 24,
          antiTheftMullion: 45,
          bead: 20,/// Junquillo
          frame: 40,// Ancho de marco
          frameMullion: 40,/// Ancho de divisores
          glassGap: 50,
    
          sashMullion: 56.5,/// Ancho de hoja
          sash: 56.5,/// Ancho de hoja
          interlock: 56.5,
          downSash: 56.5,
          upSash: 56.5,
    
          kfcWaist: 200,
          millingFrame: 5,
          millingSash: 5,
          reinforcedFrameMullion: 90,
          screen: 60,
          shadeMullion: 35,
          shadeSash: 60,
          shadeSashMullion: 60,
        };
    */
    //console.log(this.webcc.angulosCorte);
    this.webcc!.shapeManager.shapeMode = dimModeEnum.normal;
    this.webcc!.langMode = 'en-US';
    this.webcc!.shapeManager.dimFontSize = 60;

    this.webcc!.shapeManager.dragModifyOnFrame = false;
    this.webcc!.shapeManager.dragModifyOnHardware = false;

    this.webcc!.shapeManager.fixedSashToFixedGlass = false;
    //this.webcc!.shapeManager.windowStrokeColor = '#cd34bA';
    // this.webcc!.shapeManager.displayGlassSpec = true;

    // this.webcc!.shapeManager.areaSerials = {
    //   sashGlass: "Móvil-",
    //   screenNet: "Malla-",
    //   fixedGlass: "Fijo-",
    // };

    this.webcc!.eventBus.getMainStream().subscribe((e) => {
      console.log(e);

      this.materials = exportMaterials(this.webcc!, false)

      if (e.type == 'frame_hit') {
        this.selectTool(ToolType.pan);
      }

      if (e.type == 'frame_hit' || e.type == 'structure_changed') {
        return;
      }

      /// Cuando clickeo un panel de la ventana se dispara este evento,si tiene appliedOptionIndex es porque el panel
      /// pertenece a una ventana de tipo slide. Guardo el payload del evento en slideSettings para mostrar el menu de edicion de arriba a la derecha
      if (e.type == 'sash_group_settings' && e.payload.settings[0].appliedOptionIndex !== undefined) {
        this.sashGroupSettings = e.payload;
        this.selectedSlideType = e.payload.settings[0].appliedOptionIndex;
      } else {

        /// Si no es una ventana de tipo slide, oculto el menu de edicion
        this.sashGroupSettings = null;
      }
    });

    this.webcc!.shapeManager.europeanStandard = true;

    //console.log(Object.keys(this.webcc!.toolManager.tools));

    /// Revisar manejo de error al estirar perfil interno fuera de la ventana
    // window.onerror = (msg) => {
    //   if (typeof msg === 'string' && msg.includes("reading 'polygon'")) {
    //     this.selectTool(ToolType.pan);
    //     this.undo();
    //     this.redo();
    //   }
    //   return false;
    // };

    setTimeout(() => {
      this.tools = Object.keys(this.webcc!.toolManager.tools)
      let string = this.tools.reduce((acc, tool) => acc + "\n" + tool + " = " + "\'" + tool + "\'" + ', ', '');
      //console.log(string);
    });
  }

  selectTool(tool: ToolType) {
    this.selectedTool = tool;
    this.webcc!.toolManager.takeTool(this.selectedTool);
  }

  onToolSelectChange() {
    this.selectTool(this.selectedTool);
  }

  clear() {
    this.sashGroupSettings = null;
    this.webcc!.shapeManager.clear(true);
    this.materials = exportMaterials(this.webcc!, false)

  }


  isPointInsideShape = (point, shape): boolean => {
    if (!shape.polygon) {
      console.log('Polygon not found');
      return false;
    }
    return shape.polygon.box.xmax >= point.x && shape.polygon.box.xmin <= point.x && shape.polygon.box.ymax >= point.y && shape.polygon.box.ymin <= point.y;
  }

  lastClickTime = 0;
  handleClick() {
    return;
    const now = Date.now();
    if (now - this.lastClickTime < 200 && this.webcc?.toolManager.currentToolText === ToolType.pan) {
      const flat = flatChildren(this.webcc!.shapeManager.shapem[0].children);

      const glasses = flat.filter((c) => c.type === 'Glass');

      const mousePos = this.webcc!.toolManager.mousePosition;
      const glass = glasses.find(c => this.isPointInsideShape(mousePos, c));

      console.log(glass);

      if (glass) {
        var t = glass;
        t.glassSpec.customText = {
          "Asdasd": "asdasdas",
        };
        t.glassSpec.spec = 'DVH Inc. 6mm / Sep. 12mm Bronce / Sat. 4mm';
        t.glassSpec.thickness = 18;
        t.updatePoly();
        t.draw(this.webcc);
        this.webcc?.activeLayer.batchDraw();
      }
    }

    this.lastClickTime = now;
  }

  undo() {
    this.sashGroupSettings = null;
    this.webcc!.mometoManager.undo();
  }

  redo() {
    this.sashGroupSettings = null;
    this.webcc!.mometoManager.redo();
  }

  delete() {
    this.sashGroupSettings = null;
    this.webcc!.shapeManager.remove();
    this.materials = exportMaterials(this.webcc!, false)

  }


  // loop through three display modes
  //  'normal','calculate','order'
  changeDisplay() {
    this.display = (this.display + 1) % 3;

    switch (this.display) {
      case 0:
        this.webcc!.shapeManager.shapeMode = dimModeEnum.order;
        break;
      case 1:
        this.webcc!.shapeManager.shapeMode = dimModeEnum.calculate;
        break;
      default:
      case 2:
        this.webcc!.shapeManager.shapeMode = dimModeEnum.normal;
        break;
    }
  }

  exportMaterials() {
    exportMaterials(this.webcc!);
  }

  exportJson() {
    console.log(this.webcc!.shapeManager.serialize()); // download json file
  }

  print() {
    this.webcc!.shapeManager.refreshDimStatus();
    console.log(this.webcc);
  }

  updatePoly() {
    this.webcc!.shapeManager.updatePoly();
  }

  applyProfileSize() {
    const profileSize = JSON.parse(this.perfilSeleccionado) as ProfileSizeSettings;

    this.webcc!.shapeManager.shapem.forEach((shape) => {
      Object.keys(profileSize).forEach((key) => {
        shape.profileSizeManager[key] = profileSize[key];
      });
    });

    this.webcc!.shapeManager.updatePoly();
  }


  /// Si le paso true es para que elija el siguiente indice en vez de tomar el del dropdown
  /// para iterar mas rapido entre los 153 e ir viendo los diferentes tipos de ventanas
  changeSlideType(next: boolean) {
    if (!this.sashGroupSettings) return;

    const activeIndex = this.sashGroupSettings?.activeIndex;

    const slide = this.sashGroupSettings?.settings[activeIndex] as SlideSettings;

    if (!slide || slide.appliedOptionIndex === undefined) return;

    if (next) {
      if (slide.appliedOptionIndex == this.slideTypes.length - 1) {
        slide.appliedOptionIndex = 0;
      } else {
        slide.appliedOptionIndex++;
      }
    } else {
      slide.appliedOptionIndex = this.selectedSlideType;

    }

    this.selectedSlideType = slide.appliedOptionIndex;
    this.webcc!.shapeManager.updatePoly(); /// Esta funcion actualiza el canvas

    const children = flatChildren(this.webcc!.shapeManager.shapem[0].children);
    const sashes = children.filter(c => c.type === 'Sash');

    sashes.forEach(sash => {
      sash.hardwareManager.handleForSlide.dim.hidden = true;
      sash.hardwareManager.handleForSlide.dimToMid.hidden = true;
      sash.hardwareManager.handleForSlide.dimToSash.hidden = true;
      
      sash?.hardwareManager?.hardwares?.forEach(hw => {
        hw.dim.hidden = true;
        hw.dimToMid.hidden = true;
        hw.dimToSash.hidden = true;
      });
    });

    const screens = children.filter(c => c.type === 'Screen');
    screens.forEach(screen => {      
      screen?.hardwareManager?.hardwares?.forEach(hw => {
        hw.dim.hidden = true;
        hw.dimToMid.hidden = true;
        hw.dimToSash.hidden = true;
      });
    });

    this.webcc?.refresh();
    this.webcc?.shapeManager.updatePoly();
  }

  setMousePos() {
    this.mousePos = {
      x: Math.round(this.webcc!.toolManager.mousePosition.x),
      y: Math.round(this.webcc!.toolManager.mousePosition.y),
    };
  }

  importWindow() {
    if (!this.ventanaSeleccionada) return;

    this.clear();

    this.webcc!.shapeManager.openFile(this.ventanaSeleccionada.value, true, true);

    this.webcc!.shapeManager.shapem.forEach((shape) => {
      shape.topView.hidden = false;
    });

    this.webcc?.refresh();
    this.webcc?.shapeManager.updatePoly();
  }

  setHighlighted(m: DrawingComponent) {
    this.webcc!.shapeManager.hitBar(m.object.polygon.box.center, true);
  }


  changeJointWay() {
    if (!this.sashGroupSettings) return;

    this.sashGroupSettings.settings[this.sashGroupSettings.activeIndex].jointWay = Number.parseInt(this.selectedJointWay.toString());
    this.webcc!.shapeManager.updatePoly(); /// Esta funcion actualiza el canvas, el refresh() no me funcionaba
    this.materials = exportMaterials(this.webcc!, false);
  }

  changeHandleShape() {
    if (!this.sashGroupSettings) return;

    const settings = this.sashGroupSettings.settings[this.sashGroupSettings.activeIndex] as SashSettings;

    settings.handleType = this.selectedHandleShape;
    this.webcc!.shapeManager.updatePoly(); /// Esta funcion actualiza el canvas, el refresh() no me funcionaba
    this.materials = exportMaterials(this.webcc!, false);
  }

  changeHingeShape() {
    if (!this.sashGroupSettings) return;

    const settings = this.sashGroupSettings.settings[this.sashGroupSettings.activeIndex] as SashSettings;

    settings.hingeType = this.selectedHingeShape;
    this.webcc!.shapeManager.updatePoly(); /// Esta funcion actualiza el canvas, el refresh() no me funcionaba
    this.materials = exportMaterials(this.webcc!, false);
  }

}

