// Instruments del laboratori. Cada instrument té opcions (condicions de l'experiment).
// Una opció pot tenir only:[ids d'ocell] o not:[ids d'ocell] si només s'ofereix a alguns ocells.
// Per afegir-ne un: afegeix-lo aquí i afegeix la seva regla a data/results.js.
window.LAB = window.LAB || {};
LAB.instruments = [
  { id: "zugunruhe", name: "Gàbia d'intranquil·litat", icon: "🪺", short: "Els saltirons de la migració.",
    options: [ { id: "nit", name: "De nit" }, { id: "dia", name: "De dia" } ] },
  { id: "planetari", name: "Planetari celeste", icon: "✦", short: "Un cel artificial que podem girar.",
    options: [ { id: "natural", name: "Cel natural" }, { id: "girat", name: "Nord-sud girats" }, { id: "tapat", name: "Cel tapat" } ] },
  { id: "sol", name: "Sol i miralls", icon: "☀", short: "El sol com a brúixola.",
    options: [ { id: "natural", name: "Sol natural" }, { id: "miralls", name: "Sol desviat amb miralls" } ] },
  { id: "magnetic", name: "Camp magnètic", icon: "🧲", short: "Bobines que canvien el camp.",
    options: [ { id: "normal", name: "Camp normal" }, { id: "oest", name: "Camp desviat a l'oest" } ] },
  { id: "olfacte", name: "Olfacte", icon: "👃", short: "Olors i olfacte bloquejat.",
    options: [ { id: "natural", name: "Olfacte normal" }, { id: "bloquejat", name: "Olfacte bloquejat" } ] },
  { id: "vista", name: "Vista", icon: "👁", short: "Llocs coneguts i desconeguts.",
    options: [ { id: "desconegut", name: "Lloc desconegut" }, { id: "conegut", name: "Lloc més o menys conegut" }, { id: "cec", name: "Ocell «cec»" } ] },
  { id: "rellotge", name: "Rellotge intern", icon: "⏱", short: "Calcular les hores de sol.",
    options: [ { id: "llarg", name: "Dia llarg" }, { id: "curt", name: "Escurçament del dia" } ] },
  { id: "fus", name: "Fus horari", icon: "🌍", short: "Canviar l'ocell de zona horària.",
    options: [ { id: "casa", name: "Mateixa zona horària" }, { id: "oest", name: "5 zones horàries cap a l'oest" } ] },
  { id: "trasllat", name: "Trasllat", icon: "📦", short: "Portem l'ocell lluny i l'alliberem.",
    options: [ { id: "adult", name: "Ocell adult" }, { id: "jove", name: "Ocell jove (1r viatge)" },
               { id: "cilindre", name: "Cilindre tancat i aire de bombona" }, { id: "magnetic", name: "Tub amb camp magnètic constant" },
               { id: "barril", name: "Barril en moviment" }, { id: "cec", name: "Ocell «cec»" } ] },
  { id: "genetica", name: "Genètica i cria", icon: "🧬", short: "Cria en captivitat i creuaments.",
    options: [ { id: "alemanya", name: "Línia de ruta tradicional", only: ["tallarol"] },
               { id: "uk", name: "Línia que hiverna al Regne Unit", only: ["tallarol"] },
               { id: "creuament", name: "Creuament de les dues línies", only: ["tallarol"] },
               { id: "pare", name: "Línia migratòria del pare", not: ["tallarol"] },
               { id: "mare", name: "Línia migratòria de la mare", not: ["tallarol"] },
               { id: "mix", name: "Creuament de les dues línies", not: ["tallarol"] } ] }
];
// Opcions que té l'instrument per a un ocell concret
LAB.optionsFor = function (insId, spId) {
  var I = LAB.instruments.filter(function (x) { return x.id === insId; })[0];
  return I.options.filter(function (o) {
    if (o.only && o.only.indexOf(spId) < 0) return false;
    if (o.not && o.not.indexOf(spId) >= 0) return false;
    return true;
  });
};
