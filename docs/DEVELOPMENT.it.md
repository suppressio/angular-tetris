🌐 [English](DEVELOPMENT.md) | **Italiano**

# Sviluppo

Come compilare e testare Angular Tetris, e come è organizzato il codice. Per installare e giocare, vedi il [README](../README.it.md).

## Comandi

```bash
npm start        # server di sviluppo su http://localhost:4200
npm run build    # build di produzione in dist/
npm test         # test unitari (Karma, Chromium headless: imposta CHROME_BIN se non è /usr/bin/chromium)
npm run lint     # ESLint
```

## Struttura del progetto

```
src/app/
├── components/
│   ├── tetris/          ← il gioco: griglia, pezzi, mosse, eliminazione righe (tetris-utils.ts: rotazione, wall kick, pezzi casuali)
│   └── dialog/          ← finestra Settings
├── models/              ← costanti, tipi del gioco (mosse, stati, rotazioni), impostazioni
└── services/            ← stato del gioco, tastiera, impostazioni, suoni
src/assets/audio/        ← effetti sonori e musica
```

## Come funziona il gioco

- **Ciclo di gioco**: un `timer` RxJS fa scendere il pezzo corrente di una riga a ogni tick; l'intervallo dipende dalla velocità scelta in Settings. Quando il pezzo non può più scendere viene fissato, le righe piene vengono tolte ed entra il pezzo successivo; se questo collide subito, la partita è finita.
- **Input**: `InputsService` traduce ogni tasto in una mossa (giù, sinistra, destra, rotazione, caduta) o nella pausa; il componente applica la mossa solo se il pezzo ci sta.
- **Rotazione**: se il pezzo ruotato non ci sta, prova una serie di spostamenti (wall kick) prima di rinunciare.
- **Stati**: `GameStateService` tiene lo stato in un `BehaviorSubject`: `NOGAME`, `INGAME`, `PAUSE`, `GAMEOVER`. Il messaggio sulla griglia ("Pause", "Game Over") deriva da lì.

I limiti di questo impianto, e il motore che dovrebbe sostituirlo, sono in [POC-ARCHIVE.it.md](POC-ARCHIVE.it.md) e [ENGINE-BLUEPRINT.it.md](ENGINE-BLUEPRINT.it.md).
