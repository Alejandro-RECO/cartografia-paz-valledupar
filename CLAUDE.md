# Cartografía de Paz · Valledupar

Recorrido web guiado 3D por seis masacres documentadas en Valledupar (Vite + React + TS + MapLibre GL). Ver README.md, docs/IDENTIDAD_VISUAL.md y la investigación en `docs/Masacres en Valledupar — Investigación histórica y documental.md`.

## Datos (fuente de verdad: el documento de investigación)

- `datos/paradas.json`, `datos/excluidos.json`, `datos/fuentes.json` y `datos/ubicaciones.json` son copias **literales** de los bloques JSON del documento (Parte X y bloque final de coordenadas). No editarlos a mano ni completar campos vacíos: si el documento cambia, se vuelven a copiar.
- `datos/imagenes.json` (propio del proyecto) asocia cada parada con su imagen generada con IA en `public/media/fotos/`. Los PNG originales están en `docs/imagenes-ia-originales/`.
- `datos/audios.json` (propio del proyecto) asocia cada parada con su guía auditiva en `public/media/audio/<slug>.mp3` (lectura de la tarjeta, generada aparte por el usuario con ElevenLabs).
- Los casos de `excluidos.json` no se muestran en el recorrido (decisión del 2026-10-17).

## Reglas de uso de los datos (del documento, Parte X)

1. Usar solo los campos del paquete. No completar datos faltantes con conocimiento propio ni con búsquedas nuevas sin revisión humana.
2. Nunca subir el estado de una afirmación. Lo marcado `CONTROVERTIDO` o `NO_VERIFICADO` se muestra como tal o no se muestra.
3. Ningún caso de `excluidos` se publica como masacre ocurrida.
4. Si `coordenadas` es `null`, no inventar un punto. Ubicar la parada solo a nivel de corregimiento o barrio, o dejarla sin marcador hasta que una persona cargue coordenadas verificadas.
5. Las coordenadas de un centro poblado no son el lugar exacto de los hechos. Si se usan, rotularlas «ubicación aproximada del corregimiento».
6. Toda imagen generada con IA lleva el texto de `rotulo_ia`, visible junto a la imagen.
7. Cada parada muestra sus fuentes (`fuentes`) con enlace.
8. No mostrar apodos de víctimas, actividades atribuidas sin verificar ni detalles gráficos.
9. Los nombres de víctimas se muestran tal como aparecen en `victimas`, con sus variantes cuando existan.
10. Para citar textualmente fuentes de prensa, usar como máximo una frase corta por fuente, con crédito.

Reglas del mapa (`ubicaciones.json` → `reglas_mapa`): mostrar siempre la etiqueta «(ubicación aproximada)»; V-02 y V-03 comparten punto y se agrupan en un marcador sin mover el punto real; no mover puntos sin fuente nueva.

## Código

- Código, nombres y textos en español. Objetivo de pantalla: PC / proyector.
- `src/data/recorrido.ts` une paradas + ubicaciones + fuentes + imágenes; coordenadas internas en orden [lng, lat].
- Identidad "papelógrafo" (docs/IDENTIDAD_VISUAL.md). Colores en `src/styles/tokens.css` y duplicados en `src/styles/colores.ts` (el mapa no lee CSS): cambiar ambos.
- Guía auditiva: `src/data/guion.ts` lee la tarjeta (`PanelParada.tsx`) en el mismo orden; si cambia la tarjeta, cambiar ambos y correr `npm run guion` (genera `docs/guion-audio/`).
- La ruta animada vive en `src/map/ruta.ts` + capas `ruta-*` de `src/map/estiloPapelografo.ts`.
- MapLibre 6: `import * as maplibregl from 'maplibre-gl'` y `setWorkerUrl` con `?worker&url` (sin eso el mapa sale en blanco en Vite).
- Sin API keys: OpenFreeMap (vectores + glifos) y Terrain Tiles de AWS (terrarium).
- Verificar con `npm run build`, `npm run lint` y una captura real del navegador.
