🌐 [English](ENGINE-ROADMAP.md) | **Italiano**

# Roadmap di implementazione del motore

## Obiettivo

Passare dal POC archiviato a un motore riusabile più i moduli dei giochi, riducendo il rischio di riscrittura con piccole tappe.

## Tappa 0 - Chiusura dell'archivio

- segnare questo repository come istantanea del POC;
- creare e pubblicare il tag finale;
- congelare lo sviluppo di funzioni.

Criteri di uscita:

- lo stato del repository è esplicito;
- lo stato di partenza è riproducibile.

## Tappa 1 - Scheletro del nucleo del motore

- creare un nuovo workspace/repository per il motore;
- definire i contratti di base (`State`, `Command`, `Event`, `Reducer`);
- implementare il ciclo del motore con tick di simulazione fisso;
- esporre gli stream di stato ed eventi.

Criteri di uscita:

- un reducer dimostrativo gira da capo a fondo con comandi sintetici.

## Tappa 2 - Prima fetta verticale con Snake

- implementare `game-snake` usando le interfacce del motore;
- costruire un semplice adattatore di rendering (DOM o Canvas);
- collegare un adattatore di input da tastiera.

Perché prima Snake:

- poche regole;
- verifica rapidamente movimento, collisioni e tempi.

Criteri di uscita:

- demo di Snake giocabile con comportamento deterministico.

## Tappa 3 - Tetris sopra il motore

- implementare il modulo di stato e reducer del Tetris;
- aggiungere eliminazione righe, blocco del pezzo, collisione all'ingresso, wall kick;
- aggiungere gli eventi di dominio (riga eliminata, pezzo bloccato, game over).

Criteri di uscita:

- Tetris giocabile usando solo le API del motore.

## Tappa 4 - Punti di estensione per temi e audio

- aggiungere il contratto delle skin del renderer;
- aggiungere il contratto di mappatura degli eventi audio;
- fornire almeno un tema e un pacchetto di suoni predefiniti.

Criteri di uscita:

- l'app host può cambiare risorse CSS/audio senza toccare le regole del gioco.

## Tappa 5 - Stabilizzazione

- copertura di test su motore e reducer dei giochi;
- benchmark e controlli di prestazioni di base;
- pulizia delle API e documentazione.

Criteri di uscita:

- API pubblica considerata stabile per altri moduli di gioco.

## Strategia di test per priorità

1. test di determinismo dei reducer;
2. test di transizione da comando a stato;
3. test sul comportamento dei tempi;
4. test di contratto degli adattatori di rendering.

## Rischi e contromisure

- Rischio: progettare troppo, troppo presto.
  Contromisura: tenere sempre una fetta verticale giocabile.

- Rischio: mescolare rendering e logica di gioco.
  Contromisura: imporre reducer puri e adattatori di rendering.

- Rischio: API che cambiano di continuo mentre si aggiungono giochi.
  Contromisura: versionare i contratti interni e aggiungere test di compatibilità.
