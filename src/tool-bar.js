import { LitElement, html } from 'lit-element'
//import 'edugis/lib/openmaptiles-language.js';
import 'edugis/src/components/map-data-catalog.js';
import 'edugis/src/components/map-spinner.js';
import 'edugis/src/components/map-coordinates.js';
import 'edugis/src/components/button-expandable.js';
import 'edugis/src/components/map-legend-container.js';
//import 'edugis/src/components/map-measure';
import 'edugis/src/components/map-language';
import 'edugis/src/components/map-search';
import 'edugis/src/components/map-dialog';
//import 'edugis/src/components/map-gsheet-form';
import 'edugis/src/components/map-info-formatted';
//import 'edugis/src/components/map-panel';
import 'edugis/src/components/map-geolocation';
//import 'edugis/src/components/map-pitch';
//import './map-selected-layers';
//import 'edugis/src/components/map/layer/map-layer-container.js';
//import 'edugis/src/components/map/layer/map-layer-set.js';
//import 'edugis/src/components/map-draw';
//import 'edugis/src/components/map-import-export';
//import 'edugis/src/components/map-data-toolbox';
//import 'edugis/src/components/map-sheet-tool';

import "edugis/src/components/map-panel"
import "edugis/src/components/map-data-catalog"
import "edugis/src/components/map-layer-tree"
import "edugis/src/components/map-iconbutton"
import "edugis/src/components/map/layer/map-layer-container"
import "edugis/src/components/map/layer/map-layer-set"
import { importExportIcon, gpsIcon, languageIcon, arrowLeftIcon, outlineInfoIcon, combineToolIcon, threeDIcon, infoIcon, drawIcon, sheetIcon } from 'edugis/src/components/my-icons';
import { measureIcon, layermanagerIcon, searchIcon as gmSearchIcon } from 'edugis/src/gm/gm-iconset-svg';

class ToolBar extends (LitElement) {
    static get properties() {
        return {
            datacatalog: Object,
            layerlist: Array,
            thematiclayers: Array,
            backgroundLayers: Array
        }
    }

    constructor(){
        super();
        this.currentTool = '';
        this.layerlist = [];
        this.thematiclayers = [];
        this.backgroundLayers = [];
        this.toolList = [
            {name:"toolbar", visible: true, position: "opened", order: 0, info:""},
            {name:"search", visible: true, position: "", order: 100, info:"Naam, plaats of adres zoeken", icon: gmSearchIcon},
            {name:"datacatalog", visible: true, position: "", order: 101, info:"Kaartlagen", icon:layermanagerIcon},
            //{name:"measure", visible: true, position: "", order: 102, info:"Afstand en oppervlakte meten", icon: measureIcon},
            //{name:"info", visible: true, position: "", order: 103, info: "Informatie uit de kaart halen", icon: infoIcon},
            //{name:"maplanguage", visible: true, position: "", order: 104, info: "Kaarttaal", icon: languageIcon},
            //{name:"pitch", visible: true, position: "", order: 105, info: "Kaarthoek", icon: threeDIcon},
            //{name:"geolocate", visible: true, position: "", order: 106, info: "Zoom naar mijn locatie", icon: gpsIcon},
            //{name:"draw", visible: true, position: "", order: 107, info: "Tekenen", icon: drawIcon},
            //{name:"importexport", visible: true, position: "", order: 108, info: "Kaart opslaan / openen", icon: importExportIcon},
            //{name:"datatoolbox", visible: true, position: "", order: 109, info: "Gereedschapskist", icon: combineToolIcon},
            //{name:"sheetimport", visible: true, position: "", order: 110, info: "Tabel uploaden", icon: sheetIcon},
            //{name:"zoomlevel", visible: true, position: "bottom-left", order: 200, info: "Zoom-niveau"},
            //{name:"navigation", visible: true, position: "bottom-left", order: 201, info: "Zoom, Roteer"},
            //{name:"coordinates", visible: true, position: "bottom-center", order: 202},
            //{name:"scalebar", visible: true, position: "bottom-right", order: 203, info: "Schaalbalk"},
            //{name:"legend", visible: true, position: "opened", order: 204, info: "Legenda en kaartlagen"},
        ];
    }
    toggleTool(name) {
        this.infoClicked = false;
        this.updateInfoMarker();
        this.featureInfo = [];
        if (this.currentTool === name) {
          this.currentTool = '';
        } else {
          this.currentTool = name;
        }
        this.requestUpdate();
    }
    toggleToolMenu(opened) {
        const collapsed = this.shadowRoot.querySelector('#tool-menu-container').classList.contains('collapsed');
        if (collapsed && (opened === undefined || opened)) {
          this.shadowRoot.querySelector('#tool-menu-container').classList.remove('collapsed');
          this.shadowRoot.querySelector('#panel-container').classList.remove('collapsed');
          this.shadowRoot.querySelector('#button-hide-menu').classList.remove('collapsed');  
        } else {
          this.shadowRoot.querySelector('#tool-menu-container').classList.add('collapsed');
          this.shadowRoot.querySelector('#panel-container').classList.add('collapsed');
          this.shadowRoot.querySelector('#button-hide-menu').classList.add('collapsed');
        }
        this.requestUpdate();
      }
    updateInfoMarker(lngLat) {
        if (!lngLat) {
          if (this.marker) {
            this.marker.remove();
          }
          this.marker = null;
          return;
        }
        if (!this.markerDiv) {
          this.markerDiv = document.createElement('div');
          this.markerDiv.style = 'fill: blue;';
          this.markerDiv.innerHTML = outlineInfoIcon.getHTML();
          this.markerDiv.innerHTML = this.markerDiv.firstElementChild.innerHTML;
          //render (outlineInfoIcon, this.markerDiv); // no longer works?
        }
        if (this.marker) {
          this.marker.remove();
        }
        this.marker = new mapboxgl.Marker(this.markerDiv).setLngLat(lngLat).addTo(this.map);
    }
    searchResult(e){
        console.log(e.detail);
    }
    fitBounds(e){
        console.log(e.detail);
        proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
        let zoomto = proj4('EPSG:4326','EPSG:28992',e.detail.point);
        let event = new CustomEvent('zoom-to', {
            detail: {
              point: zoomto
            }
        });
        this.dispatchEvent(event);
    }
    render() {
        const toolbar = this.toolList.find(tool=>tool.name==="toolbar");
        if (!toolbar || !toolbar.visible) {
            return '';
        }
        //const showLanguageTool = this.checkMapIsLanguageSwitcherCapable();
        const tools = this.toolList.filter(tool=>tool.visible && tool.icon);
        if (tools.length == 0) {
            return '';
        }

        return html`
        <style>
        #tool-menu-container {
        position: absolute;
        display: flex;
        align-items: flex-start;
        max-width: 375px; /* #panel-container + #tools-menu */
        left: 10px;
        top: 10px;
        transition: left 0.5s ease, max-width 0.5s ease;
        pointer-events: none;
      }      
      #tool-menu-container.collapsed {
        left: -55px;
        max-width: 55px;
      }
      #tools-menu {
        box-shadow: rgba(204, 204, 204, 0.5) 1px 0px 1px 1px;
        width: 55px;
        pointer-events: auto;
      }
      #panel-container {
        width: 0px;
        transition: width 0.5s ease;
        overflow: hidden;
        pointer-events: auto;
      }
      #panel-container.active {
        width: 320px;
      }
      #panel-container.collapsed {
        width: 0px;
      }
      #tools-menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      #tools-menu ul li {
        width: 55px;
        height: 55px;
        line-height: 67px; /* vertically center svg */
        border-bottom: 1px solid rgba(204,204,204,.52);
      }
      #button-hide-menu {
        position: absolute;
        top: 0;
        right: -25px;
        width: 25px;
        height: 55px;
        cursor: pointer;
        border-left: 1px solid #c1c1c1;
        color: #666;
        fill: #666;
        background-color: rgba(250,250,250,.87);
        box-shadow: 1px 0 1px 1px rgba(204,204,204,.5);
        line-height: 65px;
        text-align: center;
        white-space: nowrap;
        transform: rotate(0deg);
        transition: transform 0.5s ease-in-out;
        pointer-events: auto;
      }
      #button-hide-menu.collapsed {
        transform: rotate(-180deg);
      }
      #button-hide-legend {
        width: 25px;
        height: 55px;
        cursor: pointer;
        border-left: 1px solid #c1c1c1;
        color: #666;
        fill: #666;
        background-color: rgba(250,250,250,.87);
        box-shadow: 1px 0 1px 1px rgba(204,204,204,.5);
        line-height: 65px;
        text-align: center;
        white-space: nowrap;
        transform: rotate(-180deg);
        transition: transform 0.5s ease-in-out;
        pointer-events: auto;
      }
      #button-hide-legend.collapsed {
        transform: rotate(0deg);
      }
      .offset {
        display: inline-block;
        width: 5px;
      }
        </style>
        <div id="tool-menu-container" class="${toolbar.position==='opened'?'':'collapsed'}">
            <div id="button-hide-menu" @click="${e=>this.toggleToolMenu()}" class="${toolbar.position==='opened'?'':'collapsed'}">
                <span class="offset"></span><i>${arrowLeftIcon}</i>
            </div>
            <div id="tools-menu">
                <ul>
                ${tools.sort((a,b)=>a.order-b.order).map(tool=>{
                    return html`<li>
                    <map-iconbutton .icon="${tool.icon}" info="${tool.info}" @click="${e=>this.toggleTool(tool.name)}" .active="${this.currentTool===tool.name}"></map-iconbutton>
                    </li>`
                })}
                </ul>
            </div>
            <div id="panel-container" class="${this.currentTool !==''?"active":""}">
                <map-panel .active="${this.currentTool==="search"}">
                    <map-search .active="${this.currentTool==="search"}" .viewbox="${this.viewbox}" 
                        @xxsearchclick="${e=>this.fitBounds(e)}" 
                        @searchresult="${e=>this.searchResult(e)}"
                    ></map-search>
                </map-panel>
                <map-panel .active="${this.currentTool==='measure'}">
                    <div id='measure' .webmap="${this.map}" .active="${this.currentTool==='measure'}">
                    Meettool
                    </div>
                </map-panel>
                <map-panel .active="${this.currentTool==="datacatalog"}">
                    <map-layer-container 
                        @movelayer="${e=>this.moveLayer(e)}" 
                        @updateopacity="${e => this.updateLayerOpacity(e)}"
                        @changefilter="${e=>this.updateLayerFilter(e)}"
                        >
                        <span slot="title">Puntenwolken</span>
                
                        <map-layer-set id="layersthematic" userreorder open .layerlist="${this.thematiclayers}" 
                        .zoom="${this.zoom}"
                        nolayer="Geen puntenwolken beschikbaar">
                            <span>Mijn puntenwolken</span>
                        </map-layer-set>
                        <map-layer-set id="layersbackground" .layerlist="${this.backgroundLayers}" 
                        .zoom="${this.zoom}"
                        .nolayer = "Geen achtergronddata beschikbaar">
                            <span>AHN3</span>
                        </map-layer-set>
            
                    </map-layer-container>
                </map-panel>

            </div>
        </div>
        `;
    
    }
}

window.customElements.define('tool-bar', ToolBar);