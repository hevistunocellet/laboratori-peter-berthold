# El laboratori de Peter Berthold · Aula i Natura

Joc interactiu del curs «Els secrets del gran viatge». Tria un ocell i un instrument, posa'ls a la cambra central i Berthold t'explica què passa.

## Obrir-lo
Fes doble clic a `index.html`. No cal cap servidor ni cap instal·lació.

## Pujar-lo a GitHub Pages
1. Crea un repositori nou, per exemple `laboratori-peter-berthold`.
2. Puja-hi **el contingut** d'aquesta carpeta (no la carpeta mateixa): `index.html`, `style.css`, `script.js`, `birds.js`, `berthold.js`, `scenes.js`, `data/` i `assets/`.
3. A *Settings → Pages*, tria *Deploy from a branch*, branca `main`, carpeta `/ (root)`.
4. La web quedarà a `https://EL-TEU-USUARI.github.io/laboratori-peter-berthold/`.

## Inserir-lo a la web (iframe)
```html
<iframe src="https://EL-TEU-USUARI.github.io/laboratori-peter-berthold/" title="El laboratori de Peter Berthold" width="100%" height="900" style="border:0" loading="lazy" allowfullscreen></iframe>
```
Comprova que la teva plataforma permet iframes. Si no, enllaça el joc.

## Estructura
- `data/species.js` — els ocells (nom, etiquetes, aspecte).
- `data/instruments.js` — instruments i condicions.
- `data/results.js` — resultats i textos de Berthold. **Aquí hi ha tot el contingut científic.**
- `birds.js` — dibuix dels ocells · `berthold.js` — el personatge · `scenes.js` — escenes de la cambra · `script.js` — interfície.

## Afegir contingut
- **Un ocell nou:** afegeix-lo a `data/species.js` (copia'n un i canvia'n el nom i els colors).
- **Un experiment nou:** afegeix l'instrument a `data/instruments.js` i la seva regla a `data/results.js`. Si és una escena nova, afegeix-la a `scenes.js`.
- Cada resultat porta un nivell: `curs`, `general`, `obert` o `cap`. No posis `curs` si el curs no ho diu.

## Criteri científic
Només es mostren com a resultat les dades que descriu el curs. Les combinacions que el curs no recull diuen que no es recullen, i proposen proves que sí que tenen resultat. Les direccions i els mapes són esquemàtics.
Berthold és un personatge de ficció dibuixat amb codi; els diàlegs són originals, no cites reals.

## Notes de la versió 2
- 8 ocells i 10 instruments. Algunes opcions només surten per a certs ocells (`only` / `not` a `data/instruments.js`).
- Nivells de resultat: curs, estudi publicat, explicació general, investigació oberta, possible però no demostrat, i «el curs no ho recull».
- `data/photos.js`: fotografies dels ocells (opcional). `sound.js`: música i sons. `assets/berthold.jpg`: foto del guia.
- `berthold.js`: `mouthY` és l'alçada del tall de la boca; `gap`, l'obertura.
