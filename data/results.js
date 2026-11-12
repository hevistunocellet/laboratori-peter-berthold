// Motor de resultats. LAB.resolve(ocell, instrument, opció) -> {level, scene, lines, note, hyp, try}
// level: "curs"     = resultat descrit al curs
//        "estudi"   = resultat d'un estudi publicat (verificat)
//        "general"  = explicació general, sense dades concretes per a aquesta espècie
//        "obert"    = investigació oberta (dubte plantejat)
//        "possible" = possible, però no demostrat en aquesta espècie
//        "cap"      = el curs no ho recull (no s'inventa cap resultat)
window.LAB = window.LAB || {};
(function () {
  function L(m, t) { return { m: m, t: t }; }
  function sp(id) { return LAB.species.filter(function (s) { return s.id === id; })[0]; }
  // REFERÈNCIA APORTADA PER L'AUTORIA DEL CURS: cal comprovar-ne el títol, l'any i l'enllaç abans de publicar.
  var REF_SNELL = "Snell i col·laboradors (2026), «Multimodal sensory manipulation of first-year migrating passerines».";
  var SIM = "Les direccions i els dibuixos són esquemàtics: il·lustren la idea, no són dades mesurades.";
  var NP = "No està demostrat en aquesta espècie: el resultat és una possibilitat, no un fet provat. ";
  function R(level, scene, lines, note, hyp) { return { level: level, scene: scene, lines: lines, note: note, hyp: hyp || null }; }

  function unknown(why, lines) {
    return R("cap", { type: "unknown" }, lines || [ L("neutral", "Aquí em toca ser honest: aquest cas concret no el tenim recollit."), L("think", why) ],
      "El curs no descriu cap resultat per a aquesta combinació, i el laboratori no se n'inventa cap.");
  }
  // Text humorístic per als casos en què traslladar l'ocell no té sentit
  function humor(n) {
    return R("cap", { type: "unknown" }, [
      L("neutral", "Aquí el curs no hi arriba: no hi ha cap experiment d'aquest tipus amb " + n + "."),
      L("serious", "I t'ho desaconsello. Si portem " + n + " lluny de la seva àrea habitual, correm el risc que vingui un munt de gent amb telescopis a veure'l i el considerin una raresa."),
      L("surprised", "Sortiria a totes les publicacions d'ornitologia, i ens hauríem de refugiar a algun país de l'Europa de l'est o de l'Orient Mitjà, cuidant un ramat de cabres i intentant passar desapercebuts, perquè ningú sàpiga que vam ser nosaltres els artífexs de l'aparició d'aquell ocell tan lluny d'on viu.")
    ], "Cas no recollit al curs ni demostrat experimentalment. El text és humorístic.");
  }

  function humorEstornell() {
    return R("cap", { type: "unknown" }, [
      L("neutral", "Aquí el curs no hi arriba: no hi ha experiments d'aquest tipus amb l'estornell."),
      L("serious", "I t'ho desaconsello, perquè això ja ho va fer Eugene Schieffelin el 1890, quan va portar estornells a Nova York."),
      L("surprised", "Ara el govern dels Estats Units gasta quantitats ingents de diners per pal·liar els danys que causen a l'agricultura.")
    ], "Cas no recollit al curs. L'episodi d'Eugene Schieffelin (1890) és un fet històric: els estornells introduïts a Nord-amèrica es van estendre i avui són una plaga.");
  }
  LAB.resolve = function (spId, ins, opt) {
    var s = sp(spId), n = s.name.toLowerCase();
    var NOCT = ["tallarol", "pit-roig"];
    var isNoct = NOCT.indexOf(spId) >= 0;

    /* ---------- GÀBIA D'INTRANQUIL·LITAT ---------- */
    if (ins === "zugunruhe") {
      if (["esparver", "gavina", "albatros"].indexOf(spId) >= 0) return R("cap", { type: "unknown" }, [
        L("surprised", "Què estàs fent?! No ho veus, que no hi cap?"),
        L("serious", "A veure si tenim dos dits de front!")], "Aquest ocell no cap a la gàbia d'intranquil·litat. El text és humorístic.");
      if (isNoct) {
        if (opt === "nit") return R("curs", { type: "rose", cue: "cage", dirs: [225] }, [
          L("neutral", "A la gàbia, l'ocell no pot volar, però fa saltirons. Això és la intranquil·litat migratòria."),
          L("happy", "Els saltirons són orientats en la direcció de la migració."),
          L("think", "I els migrants nocturns la fan sobretot des de la posta del sol fins a les 5 o 6 h del matí. És una eina d'estudi fantàstica!")],
          "Intranquil·litat migratòria (Zugunruhe), tal com es descriu al curs. " + SIM);
        return R("curs", { type: "rose", cue: "cage", dirs: [], day: true, msg: "De dia, sense direcció clara" }, [
          L("neutral", "De dia, en un migrant nocturn, gairebé no hi ha saltirons orientats."),
          L("think", "L'inici i la intensitat depenen de l'hora: aquests ocells s'activen de nit.")],
          "Segons el curs, l'inici i la intensitat de la intranquil·litat depenen de l'hora. " + SIM);
      }
      if (spId === "cucut") return opt === "nit"
        ? R("possible", { type: "rose", cue: "cage", dirs: [225] }, [ L("neutral", "El cucut migra sobretot de nit, així que és d'esperar que saltironegi de nit, orientat cap a la migració."), L("think", "Però no està demostrat amb aquesta espècie. Ho dic per no enganyar-te.")], NP + SIM)
        : R("possible", { type: "rose", cue: "cage", dirs: [], day: true, msg: "De dia, sense direcció clara" }, [ L("neutral", "De dia, un migrant nocturn com el cucut no hauria de saltironejar gaire."), L("think", "Tampoc no està demostrat en aquesta espècie.")], NP + SIM);
      // estornell, colom: migrants de dia
      var dia = spId === "colom" ? "Els coloms domèstics no migren, però saben ubicar-se i tornar al seu colomar. Altres columbids, com el tudó, sí que són migrants." : "L'estornell migra de dia.";
      return opt === "dia"
        ? R("possible", { type: "rose", cue: "cage", dirs: [225], day: true }, [ L("neutral", dia), L("think", (spId === "colom" ? "En els columbids migradors, com el tudó, " : "Per tant, ") + "la intranquil·litat es notaria de dia, amb saltirons orientats. No està demostrat en aquesta espècie.")], NP + SIM)
        : R("possible", { type: "rose", cue: "cage", dirs: [], msg: "De nit, sense direcció clara" }, [ L("neutral", dia), L("think", "De nit, doncs, descansa: no hi hauria saltirons orientats. Però no està demostrat en aquesta espècie.")], NP + SIM);
    }

    /* ---------- PLANETARI ---------- */
    if (ins === "planetari") {
      if (spId === "colom") return R("cap", { type: "rose", cue: "stars", rot: 0, dirs: [], msg: "Descansa: no s'orienta amb les estrelles" }, [
        L("neutral", "Alguns columbids, com els tudons, migren de dia; de nit prefereixen descansar."),
        L("happy", "Com a molt, miren les estrelles de manera romàntica, esperant veure un estel fugaç per demanar un desig.")], "Cas no recollit al curs. El text és humorístic.");
      if (spId === "esparver") return R("cap", { type: "rose", cue: "stars", rot: 0, dirs: [], msg: "Les estrelles no l'interessen" }, [
        L("neutral", "L'esparver és un rapinyaire que migra de dia, i aprofita per anar seguint altres ocellets que també migren de dia i que, de tant en tant, caça."),
        L("serious", "Les estrelles no l'interessen, ni tan sols les de Hollywood!")], "Cas no recollit al curs. El text és humorístic.");
      if (spId === "estornell") return R("cap", { type: "rose", cue: "stars", rot: 0, dirs: [], msg: "Per a ell, el cel és un altre estornell" }, [
        L("neutral", "L'estornell migra de dia, per tant no fa servir el planisferi celeste."),
        L("happy", "Per a ell, les estrelles són com les taquetes d'un estornell gegant que cobreix tot el món a certa hora del dia, i per això es fa de nit!"),
        L("think", "Com a hipòtesi per a una suposada religió dels estornells no està gens malament, oi?")], "Cas no recollit al curs. El text és humorístic.");
      var ART = { "tallarol": "el ", "pit-roig": "el ", "cucut": "el ", "gavina": "la ", "albatros": "l'" };
      var star = "Posem " + ART[spId] + n + " sota un cel d'estrelles i vigilem cap on vol migrar.";
      var base = (spId === "tallarol" || spId === "pit-roig" || spId === "cucut");
      var lvl = (spId === "tallarol" || spId === "pit-roig") ? "curs" : "possible";
      var pre = spId === "cucut" ? "El cucut migra sobretot de nit. I una curiositat: no coneix els seus pares, així que ningú li ensenya el camí."
              : spId === "gavina" ? "Les gavines migren de dia, però també poden fer-ho de nit. No està demostrat que sàpiguen llegir el planisferi celeste, però és possible que ho facin."
              : "No està demostrat que els albatros sàpiguen llegir el planisferi celeste. No hi ha evidència directa que utilitzin les estrelles per orientar-se: és una possibilitat plantejada, però no demostrada. Tot i així, és possible que ho sàpiguen fer, com les gavines.";
      var np = (lvl === "possible") ? NP : "";
      if (opt === "natural") return R(lvl, { type: "rose", cue: "stars", rot: 0, dirs: [225] }, base && lvl === "curs" ? [
          L("happy", star), L("neutral", "El cel nocturn li serveix per saber la direcció, i tria la de la seva migració."),
          L("think", "I això ve de ben petits: graven al cap on són les estrelles, i els servirà quan hagin de desplaçar-se.")]
        : [ L("happy", star), L("neutral", "Si llegeix el cel, tria la direcció de la seva migració."), L("think", pre) ],
        lvl === "curs" ? "Les estrelles són una de les claus d'orientació dels migrants nocturns. De ben petits graven al seu cap la situació de les estrelles, que els servirà quan hagin de desplaçar-se." : np + "El resultat és el del tallarol, aplicat per semblança. " + SIM);
      if (opt === "girat") return R(lvl, { type: "rose", cue: "stars", rot: 180, dirs: [45], tilt: 1 }, [
          L("serious", "Ara el truc: girem el planetari, amb el nord i el sud intercanviats."),
          L("surprised", lvl === "curs" ? "L'ocell «es creu» el canvi i canvia la direcció. Segueix l'orientació en funció del planisferi celeste que veu, encara que l'hàgim falsejat." : "Si llegeix el cel, «es creuria» el canvi i canviaria la direcció, seguint el planisferi encara que l'hàgim falsejat."),
          L("happy", lvl === "curs" ? "Aquesta és la prova que les estrelles són una pista real, i no una casualitat." : "Però recorda-ho: " + (spId === "cucut" ? "per al cucut" : "per a aquesta espècie") + " és una possibilitat, no un fet provat.")],
        (lvl === "curs" ? "Experiment de planetari amb el nord i el sud girats, descrit al curs. " : np) + SIM, lvl === "curs" ? { q: "Girem el planetari: el nord surt on era el sud. Què faran els ocells?", opts: ["Seguiran la seva direcció d'abans, ignorant el cel", "Giraran amb el cel", "Es quedaran quiets"], ok: 1 } : null);
      return R("general", { type: "rose", cue: "stars", rot: 0, dirs: [], tilt: 0, cloud: true }, [
          L("think", "Sense cel on veure les estrelles, l'ocell farà servir altres estratègies per orientar-se."),
          L("neutral", "Els ocells combinen claus: per exemple, camp magnètic i una pista visual. Si en falta una, en queden d'altres.")],
        "Explicació general sobre la combinació de claus. No és un resultat mesurat d'aquest experiment.");
    }

    /* ---------- SOL ---------- */
    if (ins === "sol") {
      var natural = opt === "natural";
      var sunScene = { type: "rose", cue: "sun", sunAz: 120, mirror: !natural, dirs: [natural ? 315 : 202] };
      var estHyp = natural ? null : { q: "Desviem la llum del sol amb miralls. Què faran els estornells?", opts: ["No canviaran: no miren el sol", "Es desorientaran, sense direcció clara", "Canviaran de direcció segons el sol fals"], ok: 2 };
      if (spId === "estornell") return natural
        ? R("curs", sunScene, [ L("happy", "Amb el sol al seu lloc, els estornells de l'experiment s'orienten cap al nord-oest."), L("neutral", "Ho fan mirant on és el sol. Però el sol es mou al llarg del dia...")], "Orientació amb el cel natural segons el curs. " + SIM)
        : R("curs", sunScene, [ L("serious", "Posem miralls i enganyem el sol: la llum arriba des d'una altra banda."), L("surprised", "Els estornells ja no van cap al nord-oest: van cap al sud-sud-oest."), L("happy", "Conclusió: els estornells fan servir el sol com a brúixola."), L("think", "Un detall: el sol es mou durant el dia. Per això l'ocell també ha de saber quina hora és per fer-la servir bé, i això ho fa amb el rellotge intern.")], "Experiment del sol desviat amb miralls (1960), descrit al curs. " + SIM, estHyp);
      if (spId === "cucut") return R("cap", { type: "rose", cue: "sun", sunAz: 120, mirror: !natural, dirs: [], shades: true, msg: "El cucut prefereix la nit per migrar!" }, [
        L("neutral", "Els cucuts migren principalment de nit."),
        L("happy", "El cucut prefereix la nit per migrar! Fixa't: de dia, ni se'l veu sense ulleres de sol.")], "Cas no recollit al curs. El text és humorístic.");
      var intro = {
        "tallarol": "El tallarol de casquet és un migrant bàsicament nocturn; tot i això, quan migra de dia segurament fa servir la posició del sol. O és que el sol no és sinó una estrella?",
        "pit-roig": "El pit-roig, igual que el tallarol de casquet: migrant nocturn que, en cas que en algun moment migri de dia, probablement fa servir el sol.",
        "cucut": "Els cucuts migren principalment de nit, per tant no està demostrat que sàpiguen guiar-se per la posició del sol. Tot i així, segur que el coneixen.",
        "esparver": "No està demostrat, però els esparvers migren de dia, per tant probablement fan servir el sol.",
        "colom": "Entre els columbids, les espècies que migren ho fan de dia, per tant la posició del sol hi juga segur un paper fonamental. Tenen brúixola solar.",
        "gavina": "Les gavines migren de dia i algunes també de nit. Les que ho fan de dia segurament fan servir el sol com a brúixola solar. En algunes espècies hi ha experiments que ho mostren.",
        "albatros": "Els albatros es mouen de dia i de nit. Els investigadors han plantejat que probablement fan servir diversos mecanismes, entre ells la brúixola solar."
      }[spId];
      var lv = spId === "colom" ? "general" : "possible";
      return R(lv, sunScene, natural
        ? [ L("neutral", intro), L("think", "És probable que facin servir el sol com a brúixola solar, combinada amb altres mètodes." + (lv === "possible" ? " No està demostrat experimentalment en aquesta espècie." : "")) ]
        : [ L("serious", "Posem miralls i enganyem el sol."), L("neutral", intro), L("surprised", "Si fa servir el sol com a brúixola solar, que és probable, canviaria de direcció seguint el sol fals." + (lv === "possible" ? " Però no està demostrat experimentalment en aquesta espècie." : ""))],
        (lv === "possible" ? NP : "Explicació general: es considera que els columbids migradors tenen brúixola solar. ") + SIM);
    }

    /* ---------- CAMP MAGNÈTIC ---------- */
    if (ins === "magnetic") {
      var normal = opt === "normal";
      if (isNoct) return normal
        ? R("curs", { type: "rose", cue: "magnet", fieldRot: 0, dirs: [225] }, [ L("neutral", "Amb el camp magnètic normal, el " + n + " manté la seva direcció."), L("think", "La Terra no és una esfera plana: el camp canvia d'intensitat i de direcció segons la latitud. Això pot donar informació.")], "Situació de control: camp magnètic normal. " + SIM)
        : R("curs", { type: "rose", cue: "magnet", fieldRot: -90, dirs: [180] }, [ L("serious", "Ara desviem el camp magnètic cap a l'oest amb unes bobines."), L("surprised", "L'ocell canvia de direcció! Així doncs, hi ha una percepció del camp magnètic."), L("think", "I la gran pregunta: com ho fan? On són els sensors? Fa pocs anys es va descobrir que els criptocroms hi podrien tenir un paper (2014). És una línia de recerca, no una resposta tancada.")],
            "Camp magnètic desviat a l'oest (1968), tal com es presenta al curs. Els criptocroms són una línia d'investigació. " + SIM,
            { q: "Desviem el camp magnètic cap a l'oest. Què farà l'ocell?", opts: ["Res: el camp magnètic no li serveix", "Canviarà la direcció, seguint el camp", "Volarà en cercles"], ok: 1 });
      if (spId === "albatros") return normal
        ? R("possible", { type: "rose", cue: "magnet", fieldRot: 0, dirs: [225] }, [ L("neutral", "Camp magnètic normal: és el cas de control."), L("think", "En albatros no està demostrat que el camp magnètic sigui imprescindible per orientar-se.")], NP + SIM)
        : R("estudi", { type: "rose", cue: "magnet", fieldRot: -90, dirs: [225], msg: "" }, [ L("serious", "Un experiment real amb albatros errants: se'ls van posar imants al cap per alterar la percepció del camp magnètic."),
            L("surprised", "I van continuar trobant el camí de tornada al niu, sense diferències importants ni en la durada ni en la trajectòria dels viatges."),
            L("think", "Els investigadors van plantejar que probablement fan servir altres mecanismes. Atenció: això val per als albatros, i no s'ha de generalitzar a la resta d'espècies.")], "Resultat d'un experiment publicat amb albatros errants (imants al cap). " + SIM);
      if (spId === "colom" || spId === "gavina") return normal
        ? R("general", { type: "rose", cue: "magnet", fieldRot: 0, dirs: [225] }, [ L("neutral", "En columbids (coloms) i gavines està demostrat que el camp magnètic els serveix per orientar-se."), L("neutral", "Amb el camp normal, mantenen la seva direcció.")], "Explicació general: en columbids i gavines s'ha demostrat la capacitat de percebre el camp magnètic. " + SIM)
        : R("general", { type: "rose", cue: "magnet", fieldRot: -90, dirs: [180] }, [ L("serious", "Desviem el camp magnètic cap a l'oest."), L("surprised", "En columbids i gavines està demostrat que això canvia la direcció que trien.")], "Explicació general: en columbids i gavines s'ha demostrat la capacitat de percebre el camp magnètic. " + SIM);
      return normal
        ? R("possible", { type: "rose", cue: "magnet", fieldRot: 0, dirs: [225] }, [ L("neutral", "Camp normal: l'ocell mantindria la seva direcció."), L("think", "En aquesta espècie no està demostrat que percebi el camp magnètic, però probablement el veu. Hi ha casos demostrats i d'altres que no: cal ser prudents.")], NP + SIM)
        : R("possible", { type: "rose", cue: "magnet", fieldRot: -90, dirs: [180] }, [ L("serious", "Desviem el camp magnètic cap a l'oest."), L("think", "Si en aquesta espècie el percep, i probablement el veu, canviaria de direcció. Però no està demostrat. Està demostrat en alguns ocells, i en d'altres no.")], NP + SIM);
    }

    /* ---------- OLFACTE ---------- */
    if (ins === "olfacte") {
      var ol = opt === "natural";
      if (spId === "colom") return ol
        ? R("curs", { type: "plume", wind: 60 }, [ L("neutral", "Els columbids, sobretot els coloms domèstics, són dels ocells més estudiats: molts experiments de navegació de retorn mostren que la informació olfactiva és important."), L("think", "Tot i que hi ha debat sobre el mecanisme exacte.")], "Segons el curs, l'orientació per olors està demostrada en coloms. " + SIM)
        : R("curs", { type: "plume", wind: 60, blocked: true }, [ L("neutral", "Sense olfacte, els columbids (coloms domèstics) tenen dificultats per fer la navegació de retorn."), L("think", "Com ho fa exactament, encara es debat.")], "Segons el curs, l'orientació per olors està demostrada en coloms. " + SIM);
      if (spId === "albatros") return R("obert", { type: "plume", wind: 80, sea: true, blocked: !ol }, [
          L("happy", "Aquí tenim els «nassos sospitosos»: aquests ocells tenen un bec amb tubs nasals."),
          L("neutral", "Està demostrat que utilitzen l'olfacte per localitzar preses al mar."),
          L("think", "Però si els serveix també per migrar o orientar-se, ho hem de deixar com a dubte. No ho tenim demostrat.")],
          "Segons el curs: olfacte demostrat per localitzar aliment en aus marines; hi ha dubtes sobre si serveix en la migració.");
      if (spId === "gavina") return R("estudi", { type: "plume", wind: 80, sea: true, blocked: !ol }, ol
          ? [ L("neutral", "En el gavià fosc, una gavina, s'ha demostrat experimentalment que l'olfacte és important per corregir desviacions de la ruta migratòria.")]
          : [ L("neutral", "Sense olfacte, el gavià fosc perd part de la capacitat de corregir les desviacions de la ruta migratòria."), L("think", "S'ha demostrat experimentalment, però en aquesta espècie concreta; no s'ha de generalitzar a totes les gavines.")],
          "Resultat d'un estudi publicat amb el gavià fosc (Larus fuscus). " + SIM);
      if (spId === "pit-roig") return R("obert", { type: "unknown" }, [ L("neutral", "Del pit-roig hi ha molts experiments sobre la brúixola magnètica."), L("think", "Però no hi ha una demostració concloent que faci servir l'olfacte per navegar durant la migració. Ho deixem obert.")], "Investigació oberta: sense demostració concloent en aquesta espècie.");
      if (spId === "tallarol") return R("estudi", { type: "plume", wind: 70, blocked: !ol }, ol
          ? [ L("neutral", "En experiments recents amb tallarols de casquet joves, durant la seva primera migració de tardor, es va estudiar si l'olfacte hi intervé."), L("think", "Amb l'olfacte normal, els ocells control mantenen una orientació migratòria concentrada.")]
          : [ L("neutral", "En experiments recents amb tallarols de casquet joves, l'alteració temporal de l'olfacte (anosmia) va modificar la precisió de la seva orientació migratòria: estaven menys concentrats que els controls."),
              L("think", "Això suggereix que l'olfacte pot participar en la navegació dels ocells, juntament amb altres sistemes sensorials."),
              L("serious", "Compte: la mostra era petita i això no demostra que utilitzin un mapa olfactiu, ni que es guiïn només per les olors.")],
          "Estudi recent amb tallarols de casquet joves: " + REF_SNELL + " Van aplicar un pols magnètic, sulfat de zinc (anosmia temporal) o ambdues coses, i van seguir la direcció de sortida amb radiotelemetria. Resultat prudent: mostra petita. " + SIM);
      if (spId === "estornell") return R("possible", { type: "plume", wind: 70, blocked: !ol }, [ L("neutral", ol ? "En estornells, hi ha indicis que l'olfacte intervé en la navegació de retorn i, potser, en els moviments estacionals." : "Sense olfacte, hi hauria dificultats per tornar al niu des de llocs allunyats."), L("think", "Són indicis; aquí no ho donem per demostrat.")], NP + SIM);
      if (spId === "cucut") return unknown("No hi ha estudis específics que demostrin que el cucut faci servir l'olfacte per orientar-se durant la migració.");
      return unknown("Alguns rapinyaires, com els voltors del Nou Món, semblen fer servir l'olfacte. No és el cas de l'esparver.");
    }

    /* ---------- VISTA ---------- */
    if (ins === "vista") {
      var colom = spId === "colom";
      var P = colom ? "general" : "possible", pnote = colom ? "Explicació general sobre els llocs coneguts. " : NP;
      if (opt === "cec") return colom
        ? R("curs", { type: "homing", opt: "cec" }, [ L("neutral", "Columbids (coloms) «cecs» a més de 25 m: cap problema, tornen igualment."), L("think", "O sigui: no cal veure-hi bé per trobar el camí, tot i que de prop s'ajuden de la vista.")], "Resultat descrit al curs. " + SIM)
        : unknown("Aquesta prova només la tenim recollida amb el colom.");
      return opt === "desconegut"
        ? R(P, { type: "sight", known: false }, [ L("neutral", "En un lloc que no coneix, la vista li serveix poc per saber on és: no té punts de referència."), L("think", "Per això, lluny de casa, necessita altres claus: el sol, les estrelles, el camp magnètic..."), L("serious", "I els referents visuals s'aprenen amb els anys: un ocell jove, en el primer viatge, encara no en té cap.")], pnote + SIM)
        : R(P, { type: "sight", known: true }, [ L("happy", "Un cop són en una zona més o menys coneguda, els ocells es guien molt més per la vista i pels llocs que reconeixen."), L("think", "Rius, costes, camins, edificis... són com un mapa que ja porten après."), L("serious", "Aquests referents visuals s'aprenen amb els anys: un ocell jove, en el primer viatge, encara no els té.")], pnote + SIM);
    }

    /* ---------- RELLOTGE INTERN ---------- */
    if (ins === "rellotge") {
      var curt = opt === "curt";
      var pre2 = spId === "colom" ? "Els coloms domèstics no migren, però en espècies migradores de columbids passaria així. " : "";
      var lv2 = (spId === "tallarol" || spId === "pit-roig") ? "general" : "possible";
      return R(lv2, { type: "daylen", short: curt }, curt
        ? [ L("neutral", pre2 + "El rellotge intern de l'ocell calcula les hores de sol. Ara el dia s'escurça."), L("happy", "Amb menys hores de llum, es desencadena la intranquil·litat migratòria, la zugunruhe: ja toca marxar!")]
        : [ L("neutral", pre2 + "El rellotge intern de l'ocell calcula les hores de sol: amb dies llargs, n'hi ha moltes."), L("think", "Així no hi ha pressa: no es desencadena la intranquil·litat migratòria.")],
        (lv2 === "possible" ? NP : "Explicació general: el rellotge intern calcula les hores de sol i això desencadena la zugunruhe. ") + SIM);
    }

    /* ---------- FUS HORARI ---------- */
    if (ins === "fus") {
      if (["gavina", "colom", "albatros"].indexOf(spId) < 0) return spId === "estornell" ? humorEstornell() : humor(n);
      var lvF = spId === "gavina" ? (opt === "oest" ? "curs" : "general") : "possible";
      var npF = spId === "gavina" ? "" : NP;
      return opt === "casa"
        ? R(lvF, { type: "clock", local: 15, body: 15, west: false }, [ L("neutral", "Si l'ocell és a casa, l'hora del cos i l'hora del sol coincideixen."), L("happy", "No hi ha cap desajust: res a corregir. La clau és saber quina hora és.")], npF + "Cas de control.")
        : R(lvF, { type: "clock", local: 15, body: 20, west: true }, [
            L("neutral", "L'alliberem cinc zones horàries cap a l'oest. El sol marca les 15 h, però el seu rellotge intern diu que en són les 20 h."),
            L("think", "Pensa: a les 15 h el sol és més amunt del que li tocaria a les 20 h!"),
            L("happy", "Conclusió: és cinc zones cap a l'oest. Una volada cap a l'est i cap a casa!")],
            (spId === "gavina" ? "Exemple de la gavina i el rellotge intern, tal com es planteja al curs, amb la diferència horària corregida (5 zones = 5 hores). " : npF) + SIM,
            spId === "gavina" ? { q: "Emportem una gavina cinc zones horàries a l'oest. Què creu que pensa?", opts: ["«Sóc a casa»", "«Estic molt a l'est»", "«Estic cap a l'oest»"], ok: 2 } : null);
    }

    /* ---------- TRASLLAT ---------- */
    if (ins === "trasllat") {
      if (["tallarol", "pit-roig", "cucut"].indexOf(spId) >= 0) return humor(n);
      var ad = (opt === "adult" || opt === "jove");
      if (spId === "estornell" || spId === "esparver") {
        if (!ad) return spId === "estornell" ? humorEstornell() : unknown("Aquest tractament només el recull el curs per als ocells que tornen a casa, com els columbids o l'albatros.");
        return R("curs", { type: "perdeck", young: opt === "jove" }, opt === "jove"
          ? [ L("neutral", "Aquí tenim el cas clàssic: 11.000 estornells portats a Suïssa."), L("surprised", "Els joves, en el primer viatge, migren en una direcció paral·lela a la que farien de manera natural."), L("think", "O sigui: tenen la direcció, però no saben corregir el desplaçament. Això és l'aprenentatge que els falta.")]
          : [ L("neutral", "Els adults, en canvi..."), L("happy", "Corregeixen i arriben bé! Han après durant la seva vida: ja saben on són."), L("think", "Això ens diu que hi ha una part genètica (la direcció) i una altra d'aprenentatge.")],
          "Experiment de Perdeck (1958) tal com es presenta al curs. " + (spId === "estornell" ? "" : "El curs indica que amb l'esparver es va veure el mateix resultat. ") + SIM,
          opt === "jove" ? { q: "Traslladem estornells joves, en el seu primer viatge. Cap on migren?", opts: ["Corregeixen i arriben a la zona d'hivernada", "Segueixen una direcció paral·lela a la ruta normal", "Tornen cap a casa"], ok: 1 } : null);
      }
      // colom, gavina, albatros: tornen al lloc d'origen
      var lvT = spId === "albatros" ? "curs" : spId === "colom" ? "general" : "possible";
      var npT = lvT === "possible" ? NP : "";
      if (ad) {
        if (spId === "albatros") return R("curs", { type: "albatros" }, [ L("neutral", "Portem albatros a milers de quilòmetres, en direccions diferents."), L("surprised", "De 18, 14 tornen a la colònia de Midway en menys de 30 dies! El més ràpid va fer 5.148 km en 10 dies: uns 515 km al dia."), L("think", "Tornen al seu lloc d'origen. Això ens obliga a preguntar: només amb una brúixola nord-sud, sabrien tornar de llocs desconeguts?")], "Dades del curs (Midway). " + SIM);
        return R(lvT, { type: "homing", opt: "casa" }, [ L("neutral", "Portem " + (spId === "colom" ? "un columbid (un colom domèstic)" : "la gavina") + " lluny de casa i l'alliberem."), L("happy", "Torna al seu lloc d'origen. " + (spId === "colom" ? "Els columbids, com els coloms domèstics, són famosos per això." : "En gavines també pot passar.")), L("think", "Com ho fa? Aquest és el nostre gran misteri.")], npT + (lvT === "general" ? "Explicació general sobre el retorn a casa dels columbids (coloms). " : "") + SIM);
      }
      var tx = { cilindre: "Transportat en un cilindre tancat, amb aire de bombona: cap problema.", magnetic: "Transportat en un tub amb camp magnètic constant: cap problema.", barril: "Transportat en un barril en moviment constant, amb girs aleatoris: cap problema.", cec: "Colom «cec» a més de 25 m: cap problema." };
      if (opt === "cec" && spId !== "colom") return unknown("Aquesta prova només la tenim recollida amb el colom.");
      return R(spId === "gavina" ? "possible" : "curs", { type: "homing", opt: opt }, [ L("neutral", tx[opt]), L("think", "Si res d'això els impedeix tornar, les respostes simples (olors del camí, registrar girs, desfer el camí) no n'expliquen la clau."), L("happy", "La clau és saber quina hora és. Ho veurem amb el fus horari.")],
        (spId === "gavina" ? NP : "Resultat descrit al curs; el curs no especifica l'espècie de cada prova. ") + SIM);
    }

    /* ---------- GENÈTICA ---------- */
    if (ins === "genetica") {
      if (spId === "tallarol") {
        var D = { alemanya: [225, "ruta tradicional"], uk: [315, "ruta cap al Regne Unit"], creuament: [270, "intermèdia"] }, d = D[opt];
        var m = { alemanya: "Criem tallarols de la línia tradicional, en captivitat. Sense cap mestre, saltironen en la direcció de la ruta dels pares.",
                  uk: "Ara una línia d'ocells que hivernen al Regne Unit. En captivitat, saltironen en una altra direcció: la dels seus pares.",
                  creuament: "I si s'aparellen ocells de les dues línies? Els fills agafen una direcció intermèdia." };
        return R("curs", { type: "rose", cue: "genes", dirs: [d[0]], label: d[1] }, [ L("serious", m[opt]), L("happy", "La direcció de migració està codificada genèticament: ho vam poder demostrar (1976)."),
          L("think", opt === "uk" ? "I a la natura passa de debò: als anys 60, els tallarols no hivernaven al Regne Unit; als 70 apareixen a l'hivern; als 80, anellaments a Alemanya confirmen la ruta. Un camí nou, gravat als gens. I les menjadores hi van ajudar!" : "Una ruta nova no és un tret únic: es tracta d'adaptar el que ja existia.")],
          "Experiments de control genètic (Berthold, 1976) i nova ruta migratòria, tal com es presenten al curs. Les direccions concretes són il·lustratives. " + SIM);
      }
      if (spId === "cucut") return R("cap", { type: "unknown" }, [ L("neutral", "El cucut no coneix els seus pares: ningú li ensenya el camí, i tot i així va i torna d'Àfrica."), L("think", "No hi ha experiments sobre aquest tema."), L("serious", "I ja està bé de jugar a ser Déu fent aquestes alteracions genètiques!")], "Cas no recollit al curs. El text és humorístic.");
      if (spId === "esparver") return R("cap", { type: "unknown" }, [ L("neutral", "Amb l'esparver no s'han fet experiments d'aquest tipus."), L("think", "Segurament la línia migratòria canviaria."), L("serious", "Però no has de jugar a ser Déu!")], "Cas no recollit al curs. El text és humorístic.");
      if (spId === "gavina" || spId === "albatros") return R("cap", { type: "unknown" }, [ L("neutral", "Les gavines i els albatros poden tenir molts moviments segons l'aliment disponible, i són molt més flexibles que altres tipus d'aus."), L("serious", "Igualment, compte amb jugar a ser Déu!")], "Cas no recollit al curs. El text és humorístic.");
      // pit-roig, estornell, colom
      var dirs = { pare: [225, "oest, via península Ibèrica"], mare: [135, "est, via Turquia"], mix: [180, "pel centre, creuant el Mediterrani"] }, dd = dirs[opt];
      var tx2 = { pare: "Si la línia és la del pare, els fills migren per l'oest d'Europa, via la península Ibèrica.",
                  mare: "Si és la línia de la mare, van per l'est, via Turquia.",
                  mix: "I si els creuem? Anirien pel centre, creuant el Mediterrani, i amb molts més perills. Segurament acabarien descansant en un vaixell de pesca grec, on els donarien de menjar una mica de iogurt (grec, per suposat!)." };
      var extra = spId === "estornell" ? "No hi ha experiments que ho demostrin, tot i que la seva direcció migratòria té un bon component genètic." : spId === "colom" ? "Seria semblant en els columbids migradors, però tampoc no hi ha experiments que ho afirmin." : null;
      var lns = [ L("neutral", tx2[opt]) ]; if (extra) lns.push(L("think", extra));
      if (opt === "mix") lns.push(L("serious", "I recorda: no s'ha de jugar a ser Déu amb els gens dels ocells!"));
      return R("possible", { type: "rose", cue: "genes", dirs: [dd[0]], label: dd[1] }, lns, NP + "No hi ha experiments d'aquest tipus. Les direccions són il·lustratives. " + SIM);
    }

    return unknown("No tinc cap dada d'aquesta combinació.");
  };

  LAB.levels = {
    curs:     { name: "Resultat descrit al curs", cls: "lv-curs" },
    estudi:   { name: "Resultat d'un estudi publicat", cls: "lv-estudi" },
    general:  { name: "Explicació general", cls: "lv-general" },
    obert:    { name: "Investigació oberta", cls: "lv-obert" },
    possible: { name: "Possible, però no demostrat", cls: "lv-possible" },
    cap:      { name: "El curs no ho recull", cls: "lv-cap" }
  };
})();

/* Suggeriments: quan el curs no recull un cas, proposem proves amb resultat (clicables al joc). */
(function () {
  var raw = LAB.resolve;
  LAB.resolve = function (spId, ins, opt) {
    var r = raw(spId, ins, opt);
    if (r.level !== "cap") return r;
    var out = [];
    function add(sp, i, o) { if (out.length >= 3) return; if (raw(sp, i, o).level !== "cap") out.push({ sp: sp, ins: i, opt: o }); }
    LAB.instruments.forEach(function (I) { if (I.id !== ins) { var os = LAB.optionsFor(I.id, spId); if (os.length) add(spId, I.id, os[os.length > 1 ? 1 : 0].id); } });
    LAB.species.forEach(function (S) { if (S.id !== spId) LAB.optionsFor(ins, S.id).forEach(function (O) { add(S.id, ins, O.id); }); });
    r.try = out;
    return r;
  };
})();
