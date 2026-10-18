# Cartografía de Paz · Valledupar

Recorrido web guiado en 3D por seis masacres documentadas en Valledupar (Cesar), 1996–2024, con estilo de cartografía social. Proyecto de Cátedra de Paz.

## Comandos

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
npm run build    # genera la versión final en dist/
npm run preview  # prueba la versión final
npm run format   # ordena el código
```

## Controles del recorrido

- **→ / Espacio / PageDown**: siguiente parada (sirve con presentador inalámbrico)
- **← / PageUp**: parada anterior
- **Inicio**: volver a la portada
- Clic en un pin del mapa: ir a esa parada

## Actualizar el contenido

El contenido sale de la investigación (`docs/Masacres en Valledupar — Investigación histórica y documental.md`), no se escribe en el código.

1. Corrige el documento de investigación.
2. Vuelve a copiar sus bloques JSON a `datos/paradas.json`, `datos/excluidos.json`, `datos/fuentes.json` y `datos/ubicaciones.json`, sin editarlos a mano.
3. Para cambiar la imagen de una parada, deja el `.webp` en `public/media/fotos/` y apúntalo en `datos/imagenes.json`.
4. Guarda: el navegador se actualiza solo.

## Estructura

| Ruta | Qué contiene |
|---|---|
| `datos/*.json` | Datos de la investigación (copias literales del documento) |
| `src/data/recorrido.ts` | Une paradas, ubicaciones, fuentes e imágenes |
| `src/config/proyecto.ts` | Título, lema, créditos |
| `src/config/map.ts` | Cámara, relieve, velocidad de vuelo, fuentes de datos |
| `src/map/estiloPapelografo.ts` | Estilo visual del mapa |
| `src/data/anotaciones.ts` | Rótulos a mano sobre el mapa |
| `src/styles/tokens.css` + `colores.ts` | Colores y tipografías |
| `docs/IDENTIDAD_VISUAL.md` | Guía de identidad visual |

## Tecnología

Vite · React 19 · TypeScript · MapLibre GL (terreno 3D). Mapa base de [OpenFreeMap](https://openfreemap.org) (datos © OpenStreetMap) y relieve de Mapzen Terrain Tiles en AWS. Todo gratis y sin API keys.

**Requiere internet** para cargar el mapa y los videos de YouTube. Fuentes, fotos y audios son locales.
