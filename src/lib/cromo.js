import * as THREE from 'three';

/**
 * LA MATERIA DE KAIZEN: el cromo de la cinta, que también llevan Kai (el guía)
 * y el teléfono 3D de Demos. Un solo lugar para los tonos y para el ENTORNO DE
 * ESTUDIO que refleja: cajas de luz largas, como en una foto de producto, en
 * vez del cuarto genérico de three (RoomEnvironment daba manchas suaves; esto
 * da filos de luz nítidos que recorren el metal).
 */
export const TONOS = {
  dark: { color: '#efeae0', metalness: 1, roughness: 0.14, envMapIntensity: 1.25 },
  light: { color: '#3a3734', metalness: 0.85, roughness: 0.2, envMapIntensity: 1.1 },
};

/** Aplica el tono del tema a un MeshPhysicalMaterial / MeshStandardMaterial */
export function tonoCromo(material, tema) {
  const p = TONOS[tema] || TONOS.dark;
  material.color.set(p.color);
  material.metalness = p.metalness;
  material.roughness = p.roughness;
  material.envMapIntensity = p.envMapIntensity;
}

/**
 * @param opts.frente  luz suave de frente (relleno). Apagarla en objetos con
 *   una cara oscura y pulida (el visor de Kai): se refleja como un cuadro.
 * @param opts.relleno gris del cuarto: más bajo = cromo con más contraste
 */
export function entornoEstudio(renderer, { frente = true, relleno = 0.11 } = {}) {
  const s = new THREE.Scene();
  const mats = [];
  const geos = [];
  const pieza = (geo, color, lado) => {
    const mat = new THREE.MeshBasicMaterial({ color, side: lado });
    mats.push(mat);
    geos.push(geo);
    const m = new THREE.Mesh(geo, mat);
    s.add(m);
    return m;
  };
  pieza(new THREE.BoxGeometry(24, 24, 24), new THREE.Color(relleno, relleno, relleno * 1.04), THREE.BackSide);
  const luz = (w, h, x, y, z, i) => {
    const m = pieza(new THREE.PlaneGeometry(w, h), new THREE.Color(i, i, i * 0.96), THREE.DoubleSide);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
  };
  luz(16, 6, 0, 11, 3, 7); // caja de luz grande arriba
  luz(1.4, 18, -11, 0, 4, 16); // tira larga a la izquierda
  luz(0.9, 18, 11, 2, -3, 11); // tira fina a la derecha
  luz(0.7, 14, 5, 0, -11, 9); // filo de contra
  luz(10, 3, 0, -11, 4, 1.6); // rebote del piso
  if (frente) luz(7, 7, 0, 2, 11.5, 0.9); // relleno de frente
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(s, 0.025).texture;
  pmrem.dispose();
  mats.forEach((m) => m.dispose());
  geos.forEach((g) => g.dispose());
  return tex;
}
