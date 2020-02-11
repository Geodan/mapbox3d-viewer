import { LitElement, html } from 'lit-element';
import "./tool-bar"
import "@geodan/gm-beta-mapbox3d/build/gm-beta-mapbox3d";
import "@geodan/gm-profile-panel/build/dist/gm-profile-panel"
import "@geodan/gm-document-reader/build/dist/gm-document-reader"

class Mapbox3DViewer extends (LitElement) {
  static get properties() {
    return {
      account: String,
      configname: String,
      gmconfig: {type: Object},
      datacatalog: Object,
      layerlist: Array,
    }
  }
  constructor() {
    super();
    this.account = this.getUrlParam('account','GEOD5732RESE');
    this.configname = this.getUrlParam('config','bcc74133-5a27-47f7-9bf1-1e649497bc7b');
    this.datacatalog = null;
    this.layerlist = [];
    this.thematiclayers = [];
    this.backgroundLayers = [];
  }
  render() {
    return html`
      <style>
      :host{
        display: block;
        width: 100%;
        height: 100%;
      }
      gm-beta-mapbox3d {
        position: absolute;
        display: block;
        width: 100%; 
        height: 100%;
      }
      #tool-bar {
        position: absolute;
        display: block;
        width: 100%; 
        left: 10px;
        top: 10px;
        box-sizing: border-box;
      }      
      
      #legend-container-container {
        position: absolute;
        display: flex;
        flex-direction: row;
        top: 10px;
        right: 10px;
        justify-content: flex-end;
        transition: right 0.5s ease;
        pointer-events: none;
        box-sizing: border-box;
      }
     
      </style>

      <gm-document-reader
      environment="p"
      gm-fire
      is-public
      is-public-account
      get-data
      .account="${this.account}"
      service="config"
      .name="${this.configname}"
      @gm-document-retrieved="${(e)=>this.parseconfig(e.detail.data)}"
    ></gm-document-reader>
    <gm-profile-panel logo-url="./images/geodan_beta.png"
      xdisplay-name="Voornaam Achternaam"
      xshow-initials
      geodan-maps-logout-url="https://services.geodan.nl/sso/sp/Logout"
      ahp-logout-url="https://apps.geodan.nl/sso/sp/Logout"
      logout-title="Uitloggen"
      show-menu
      menu-items='[{"title": "GeodanMaps", "url": "https://www.geodanmaps.nl/" }, {"title": "Geodan", "url": "https://www.geodan.nl"}]'
    ></gm-profile-panel>
   
    <gm-beta-mapbox3d></gm-beta-mapbox3d>

    <tool-bar 
      .thematiclayers="${this.thematiclayers}"
      .backgroundLayers="${this.backgroundLayers}"
      @searchclick="${e=>this.fitBounds(e)}"
      @updatevisibility="${(e) => this.updateLayerVisibility(e.detail)}"
      ></tool-bar>
  `;
  }
  getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }

  getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = this.getUrlVars()[parameter];
        }
    return urlparameter;
  }

  set gmconfig(config) {
    this._gmconfig = config;
    
    //const urlParams = new URLSearchParams(window.location.search);
    
  } 
  parseconfig(config){
    let mapbox = this.shadowRoot.querySelector('gm-beta-mapbox3d');
    setTimeout(_=>{
    config.map.layers.map(l=>{
      if (l.source['3dtiles'] === 'true') {
        return {
          id: String(l.id), 
          type: '3dtiles',
          url: l.source.url
        }
      }
      else if (l.source.type === 'OGC_WMTS'){
        return {
          id: String(l.id),
          type: 'raster',
          source: {
            type: 'raster',
              tiles: [
                l.source.url
              ],
          tileSize: 256
          },
          paint: {}
        }
      }
    }).forEach(l=>mapbox.addLayer(l));
  },2000);
/*
    
    //let layers3d = config.map.layers.filter(d=>d.source['3dtiles'] === 'true');
    //let layerswmts = config.map.layers.filter(d=>d.source.type === 'OGC_WMTS');
    setTimeout(_=>{
      layerswmts.forEach(l=>{
        mapbox.addLayer(
          {
          'id': String(l.id),
          'type': 'raster',
          'source': {
            'type': 'raster',
              'tiles': [
                l.source.url
              ],
          'tileSize': 256
          },
          'paint': {}
          }
        );
      });
      layers3d.forEach(l=>{
        mapbox.addLayer({
          id: l.id, 
          type: '3dtiles',
          url: l.source.url
        });
      });
    },2000);
    */
    let alllayers = config.map.layers.map(d=>{
      return {
        id: String(d.id),
        minzoom: 5.5,
        maxzoom: 12.5,
        metadata: {
          getFeatureInfoUrl: null,
          legendurl: null,
          maplayeropen: false,
          reference: false,
          title: d.title,
          userlayer: true,
          wms: true
        },
        type: 'wms',
        source: null,
        isBaseLayer: d.isBaseLayer
      };
    });
    
    let toolbar = this.shadowRoot.querySelector('tool-bar');
    toolbar.thematiclayers = alllayers.filter(d=>d.isBaseLayer==false);
    toolbar.backgroundLayers = alllayers.filter(d=>d.isBaseLayer==true);

    let el = this.shadowRoot.querySelector('gm-beta-mapbox3d');
    el.map.setCenter([config.map.view.center.x,config.map.view.center.y]);
    el.map.setZoom(config.map.view.zoom);
    
    setTimeout(_=>{
      mapbox.map.triggerRepaint();
    },5000);
  }
  updateLayerVisibility(layer){
    let el = this.shadowRoot.querySelector('gm-beta-mapbox3d');
    el.toggleVisible(layer.layerid);
  }
  fitBounds(e){
    let el = this.shadowRoot.querySelector('gm-beta-mapbox3d');
    el.flyTo(e.detail.point);
  }
}

window.customElements.define('mapbox3d-viewer', Mapbox3DViewer);