🌐 [English](README.md) | **Italiano**

# Angular Tetris

Il Tetris classico nel browser, fatto con Angular e RxJS: sposta e ruota i pezzi che cadono, completa le righe per eliminarle e non lasciare che la pila arrivi in cima.

![Angular Tetris](https://github.com/user-attachments/assets/dd5c9426-1d16-423d-8252-ca686873601b)

- Movimento dei pezzi, rotazione con wall kick, eliminazione delle righe e game over.
- Pausa e ripresa in qualsiasi momento.
- Impostazioni: velocità del gioco, suoni sì/no, volume di effetti e musica.

> **Proof of concept, congelato.** Il repository resta come istantanea stabile (tag `v1-poc-final`): solo correzioni alla documentazione e aggiornamenti di sicurezza, niente nuove funzioni. Cosa ha insegnato, e il piano per un motore di gioco riusabile, sono in [docs/](#documentazione).

---

## Installazione e avvio

Serve [Node.js](https://nodejs.org) 20.19 o successivo (Angular 21).

```bash
npm install
npm start
```

Poi apri http://localhost:4200 e premi **Start**.

## Come si gioca

| Tasto | Azione |
|---|---|
| ← / → | sposta il pezzo a sinistra / destra |
| ↓ | sposta il pezzo giù di una riga |
| ↑ | fa cadere il pezzo fino in fondo |
| Spazio | ruota |
| Z | ruota nell’altro senso |
| P (o il tasto Pausa) | pausa / ripresa |

**Start** avvia una nuova partita; **Settings** imposta la velocità (1–10), attiva o disattiva i suoni e regola il volume di effetti e musica.

---

## Documentazione

- [docs/DEVELOPMENT.it.md](docs/DEVELOPMENT.it.md): build, test, struttura del progetto, come funziona il ciclo di gioco
- [docs/POC-ARCHIVE.it.md](docs/POC-ARCHIVE.it.md): cosa ha dimostrato questo proof of concept, e perché è congelato
- [docs/ENGINE-BLUEPRINT.it.md](docs/ENGINE-BLUEPRINT.it.md): architettura del motore di gioco 2D riusabile che verrà dopo
- [docs/ENGINE-ROADMAP.it.md](docs/ENGINE-ROADMAP.it.md): le tappe per arrivarci

## Licenza

[MIT](LICENSE) © 2024 Daniele 'suppressio'.
