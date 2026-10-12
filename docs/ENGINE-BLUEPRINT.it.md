🌐 [English](ENGINE-BLUEPRINT.md) | **Italiano**

# Progetto del motore riusabile

## Visione

Costruire un piccolo motore riusabile per giochi 2D nel browser, come libreria TypeScript, e poi implementare i giochi (Tetris, Snake, un clone di Bomberman, Scacchi) come moduli separati.

## Principi di progetto

1. Nucleo puro, guscio reattivo.
2. Separazione netta tra simulazione e rendering.
3. API del motore indipendenti dal framework.
4. Grafica, temi CSS e suoni intercambiabili.
5. Regole del gioco come logica di dominio isolata.

## Architettura a livelli

### 1) Nucleo del motore

Responsabilità:

- orologio del gioco e passi di simulazione fissi;
- ricezione dei comandi;
- ciclo di aggiornamento deterministico;
- emissione degli eventi.

Interfacce di base:

- `EngineState`
- `EngineCommand`
- `EngineEvent`
- `GameReducer<TState, TCommand, TEvent>`

### 2) Moduli con la logica dei giochi

Ogni gioco possiede:

- il modello di stato;
- reducer e regole;
- eventi di dominio;
- condizioni di vittoria e sconfitta.

Esempi:

- `@games/tetris`
- `@games/snake`
- `@games/chess`

### 3) Adattatori di rendering

Il livello di rendering traduce lo stato del gioco in grafica senza modificare lo stato di dominio.

Adattatori possibili:

- renderer a griglia DOM;
- renderer Canvas;
- renderer SVG facoltativo.

### 4) Pacchetti di skin e audio

Risorse personalizzabili dall'utente:

- temi CSS;
- pacchetti di sprite;
- pacchetti di suoni associati per nome evento.

### 5) Applicazioni host

L'app del framework (Angular) si occupa di:

- montare l'istanza del motore;
- collegare gli input;
- scegliere renderer, tema e pacchetti audio;
- i controlli dell'interfaccia (avvio, pausa, impostazioni).

## Flusso a runtime

1. L'adattatore di input emette comandi.
2. La sorgente dei tick emette gli eventi dei passi di simulazione.
3. Il reducer calcola lo stato successivo.
4. Il motore emette gli eventi di dominio.
5. Gli adattatori di rendering e audio reagiscono.

## Modello dei tempi

Tenere concettualmente separati due orologi:

- tick di simulazione (passo fisso);
- cadenza di rendering (aggiornamento dell'interfaccia).

Per i giochi a griglia, iniziare semplice:

- passo di simulazione fisso;
- rendering solo quando lo stato cambia.

## API pubblica minima (bozza)

```ts
interface EngineConfig<TState, TCommand, TEvent> {
  initialState: TState;
  reducer: (state: TState, input: TCommand | { type: 'tick' }) => {
    state: TState;
    events?: TEvent[];
  };
}

interface Engine<TState, TCommand, TEvent> {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  dispatch(command: TCommand): void;
  state$(): unknown;
  events$(): unknown;
}
```

## Pacchettizzazione suggerita

Monorepo con i pacchetti:

- `packages/engine-core`
- `packages/renderer-dom`
- `packages/game-tetris`
- `apps/angular-host`

Così i confini restano espliciti e l'iterazione in locale resta veloce.
