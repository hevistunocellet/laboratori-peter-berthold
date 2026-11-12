// Espècies del laboratori. Per afegir-ne una: afegeix un objecte aquí (i, si cal, regles a data/results.js).
// "look" descriu com es dibuixa l'ocell (vegeu birds.js). "tags" s'usen a les regles de resultats.
window.LAB = window.LAB || {};
LAB.species = [
  { id: "tallarol", name: "Tallarol de casquet", sci: "Sylvia atricapilla", tags: ["nocturn"],
    intro: "El tallarol de casquet! El meu vell conegut: porta una brúixola dins els gens.",
    look: { body: "#8a8372", belly: "#d8d4c6", head: "#8a8372", cap: "#1c1c1c", bill: { l: 9, c: "#3a3a3a" }, tail: 24 } },
  { id: "pit-roig", name: "Pit-roig", sci: "Erithacus rubecula", tags: ["nocturn"],
    intro: "El pit-roig, un petit ocell que ens permetrà parlar del camp magnètic.",
    look: { body: "#7a6a4e", belly: "#e9e2d0", head: "#7a6a4e", face: "#e0622a", bill: { l: 8, c: "#2e2e2e" }, tail: 22, legs: "#6b4a3a", round: true } },
  { id: "colom", name: "Colom", sci: "Columbidae", tags: ["diürn"],
    intro: "Un columbid: parlem de coloms en general, del colom domèstic al tudó",
    look: { body: "#8a95a6", belly: "#9aa5b5", head: "#7d8898", neckPatch: "#5a9a7a", wingBars: true, bill: { l: 9, c: "#4a4a4a", cere: true }, tail: 22, round: true } },
  { id: "cucut", name: "Cucut", sci: "Cuculus canorus", tags: [],
    intro: "El cucut: el pollet no coneix els pares, i tot i així va i torna d'Àfrica.",
    look: { body: "#7d8793", belly: "#e8e6df", head: "#7d8793", barred: true, eyering: "#e8c63a", bill: { l: 11, c: "#2e2e2e" }, tail: 34 } },
  { id: "esparver", name: "Esparver", sci: "Accipiter nisus", tags: [],
    intro: "L'esparver, un rapinyaire àgil i discret",
    look: { body: "#6f7f92", belly: "#e4d3bc", head: "#6f7f92", barred: "#b5703c", eyering: "#f0c93a", bill: { l: 9, c: "#2e2e2e", hook: true }, tail: 36, big: true } },
  { id: "gavina", name: "Gavina", sci: "Larus sp.", tags: ["marí"],
    intro: "La gavina, un ocell marí amb molts recursos",
    look: { body: "#f1f1ee", belly: "#fafaf8", head: "#f4f4f2", wing: "#9fa9b3", wingTip: "#222", bill: { l: 14, c: "#e6b830", spot: true }, tail: 22, big: true, longwing: true } },
  { id: "albatros", name: "Albatros", sci: "Diomedeidae", tags: ["marí"],
    intro: "L'albatros, el gran navegant de l'oceà",
    look: { body: "#f4f4f2", belly: "#fbfbf9", head: "#f4f4f2", wing: "#3b3a3a", bill: { l: 20, c: "#e9a89a", hook: true, tube: true }, tail: 18, longwing: true, big: true } },
  { id: "estornell", name: "Estornell", sci: "Sturnus vulgaris", tags: ["diürn"],
    intro: "L'estornell, que ens ha donat molt que pensar",
    look: { body: "#262c38", belly: "#2f3644", head: "#2d3a48", speckle: true, sheen: "#4a6a5a", bill: { l: 14, c: "#e8c63a" }, tail: 16 } }
];
