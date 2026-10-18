import type { Feature, LineString } from 'geojson'
import type { RasterDEMSourceSpecification, StyleSpecification } from 'maplibre-gl'
import { EXAGERACION_TERRENO, FUENTES } from '../config/map'
import { COLORES as C } from '../styles/colores'
import { gradienteHasta } from './ruta'

const ATRIBUCION_RELIEVE =
  '<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Mapzen Terrain</a>'

const relieve: RasterDEMSourceSpecification = {
  type: 'raster-dem',
  tiles: [FUENTES.relieve],
  encoding: 'terrarium',
  tileSize: 256,
  maxzoom: 15,
}

/** Estilo "papelógrafo": papel periódico, trazos de marcador y la ruta del recorrido en amarillo cañaguate. */
export function estiloPapelografo(ruta: Feature<LineString>): StyleSpecification {
  return {
    version: 8,
    glyphs: FUENTES.glifos,
    sources: {
      osm: { type: 'vector', url: FUENTES.vectores },
      terreno: { ...relieve, attribution: ATRIBUCION_RELIEVE },
      sombreado: { ...relieve }, // fuente separada para el sombreado (recomendado por MapLibre)
      ruta: { type: 'geojson', data: ruta, lineMetrics: true },
    },
    terrain: { source: 'terreno', exaggeration: EXAGERACION_TERRENO },
    sky: {
      'sky-color': C.papelografo,
      'horizon-color': C.papelografo,
      'fog-color': C.papelografo,
      'sky-horizon-blend': 0.5,
      'horizon-fog-blend': 0.8,
      'fog-ground-blend': 0.8,
    },
    layers: [
      { id: 'fondo', type: 'background', paint: { 'background-color': C.papelografo } },
      {
        id: 'bosque',
        type: 'fill',
        source: 'osm',
        'source-layer': 'landcover',
        filter: ['in', ['get', 'class'], ['literal', ['wood', 'forest']]],
        paint: { 'fill-color': C.verde, 'fill-opacity': 0.14 },
      },
      {
        id: 'parques',
        type: 'line',
        source: 'osm',
        'source-layer': 'park',
        paint: { 'line-color': C.verde, 'line-width': 2, 'line-opacity': 0.7 },
      },
      {
        id: 'relieve',
        type: 'hillshade',
        source: 'sombreado',
        paint: {
          'hillshade-shadow-color': C.tierra,
          'hillshade-highlight-color': C.hoja,
          'hillshade-accent-color': C.verde,
          'hillshade-exaggeration': 0.4,
        },
      },
      {
        id: 'agua',
        type: 'fill',
        source: 'osm',
        'source-layer': 'water',
        paint: { 'fill-color': C.azulClaro, 'fill-outline-color': C.azul },
      },
      {
        id: 'rios',
        type: 'line',
        source: 'osm',
        'source-layer': 'waterway',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': C.azul,
          'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1.5, 16, 7],
        },
      },
      {
        id: 'vias-menores',
        type: 'line',
        source: 'osm',
        'source-layer': 'transportation',
        filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'track', 'path']]],
        minzoom: 13,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': C.negro,
          'line-opacity': 0.35,
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.5, 18, 3],
        },
      },
      {
        id: 'vias-principales',
        type: 'line',
        source: 'osm',
        'source-layer': 'transportation',
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary']],
        ],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': C.negro,
          'line-opacity': 0.75,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 18, 7],
        },
      },
      {
        id: 'edificios-3d',
        type: 'fill-extrusion',
        source: 'osm',
        'source-layer': 'building',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': C.edificio,
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 6],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
          'fill-extrusion-opacity': 0.9,
        },
      },

      // Ruta del recorrido: punteada lo que falta, cañaguate lo recorrido (se anima en MapaValledupar)
      {
        id: 'ruta-pendiente',
        type: 'line',
        source: 'ruta',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.negro, 'line-width': 5, 'line-opacity': 0.7, 'line-dasharray': [0.1, 3] },
      },
      {
        id: 'ruta-borde',
        type: 'line',
        source: 'ruta',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-width': 16, 'line-gradient': gradienteHasta(0, C.negro) },
      },
      {
        id: 'ruta-recorrida',
        type: 'line',
        source: 'ruta',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-width': 10, 'line-gradient': gradienteHasta(0) },
      },

      {
        id: 'nombres-vias',
        type: 'symbol',
        source: 'osm',
        'source-layer': 'transportation_name',
        minzoom: 15,
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Regular'],
          'text-size': 13,
        },
        paint: { 'text-color': C.tierra, 'text-halo-color': C.papelografo, 'text-halo-width': 2 },
      },
      {
        id: 'lugares',
        type: 'symbol',
        source: 'osm',
        'source-layer': 'place',
        // Solo pueblos (no veredas ni «Región…», que saturan el mapa); Valledupar va como anotación a mano
        filter: ['in', ['get', 'class'], ['literal', ['town', 'village']]],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Bold'],
          'text-size': ['match', ['get', 'class'], 'town', 16, 13],
        },
        paint: { 'text-color': C.negro, 'text-halo-color': C.papelografo, 'text-halo-width': 2 },
      },
    ],
  }
}
