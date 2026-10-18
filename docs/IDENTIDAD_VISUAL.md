# Identidad visual: papelógrafo

**Concepto:** el mapa es el pliego de un taller de cartografía social: papel periódico doblado en cuatro, dibujos con marcador y hojas pegadas con cinta de enmascarar. El tono es **esperanza y territorio**: el camino recorrido se pinta en amarillo **cañaguate**, el árbol que florece en Valledupar.

Mock aprobado: https://claude.ai/artifact/6eWFLUFJ1P7adtpPDjPZyj

## Elemento memorable

La ruta del recorrido se **dibuja sola** en amarillo mientras la cámara vuela a la siguiente parada. Lo que falta por recorrer se ve punteado. Todo lo demás es sobrio para no competir con ella.

## Color (`src/styles/tokens.css` y `src/styles/colores.ts`)

| Nombre | Hex | Uso |
|---|---|---|
| Papelógrafo | `#E9E6DA` | Fondo del mapa |
| Hoja | `#F6F4EE` | Hojas pegadas (panel, portada, convenciones) |
| Marcador negro | `#262420` | Texto, bordes, vías |
| Marcador azul | `#2456A6` | Ríos, audio, foco del teclado |
| Marcador verde | `#2E7A4C` | Montaña, bosque, parques |
| Cañaguate | `#F2B705` | Camino recorrido, parada actual, botón principal |
| Tierra | `#6E5239` | Texto secundario, sombras del relieve |

## Tipografía (incluida en el proyecto, funciona sin internet)

- **Kalam:** títulos, números de parada, botones y rótulos del mapa. Parece escrita con marcador.
- **Atkinson Hyperlegible Next:** textos largos. Está diseñada para personas con baja visión y se lee bien en proyector.
- Escala en pantalla de 1920 px: 104 / 68 / 38 / 27 / 22 px.

## Reglas

1. Todo texto sobre el mapa va en una **hoja con cinta**, nunca suelto.
2. Paradas: blanco = por visitar, cañaguate = visitada, cañaguate grande con halo = actual.
3. Bordes con radios irregulares (`--radio-mano`): nada se ve hecho con regla.
4. Una sola animación de interfaz: la hoja que se pega al cambiar de parada. La ruta es la protagonista.
5. Fotos en `.webp` o `.jpg`, máximo 1600 px de ancho y 300 KB, con marco blanco tipo foto impresa.

## Nombres propuestos (elegir uno y ponerlo en `src/config/proyecto.ts`)

- **Caminos del Guatapurí:** el río como hilo del recorrido; encaja con la ruta dibujada.
- **Upar Florece:** del cacique Upar; «florece» por el cañaguate.
- **Territorio que Canta:** el vallenato como memoria viva.
- **Raíces y Acordeones:** los pueblos de la Sierra y la cultura vallenata.
