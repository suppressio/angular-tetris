🌐 [English](POC-ARCHIVE.md) | **Italiano**

# Note di archivio del POC

## Scopo

Questo repository resta come Proof of Concept storico per:

- provare i pattern RxJS in un ciclo di gioco nel browser;
- verificare le meccaniche di base del Tetris in Angular;
- raccogliere le lezioni apprese prima di costruire un motore riusabile.

## Nome consigliato per il repository

- Nome di archivio suggerito: `poc-angular-tetris`.

Si può fare così:

1. rinomina della cartella locale;
2. rinomina del repository sull'host remoto;
3. aggiornamento dei remote git locali.

## Regole di congelamento

Il repository va considerato bloccato, salvo:

- correzioni alla documentazione;
- manutenzione di dipendenze e sicurezza, se strettamente necessaria;
- nessuna nuova funzione di gioco.

## Azioni git suggerite

1. Creare un tag finale per lo stato del POC.
2. Proteggere il branch predefinito.
3. Aggiungere una breve nota di archivio nella descrizione del repository.

Comandi di esempio:

```bash
git tag -a v1-poc-final -m "Final Angular Tetris POC snapshot"
git push origin v1-poc-final
```

## Cosa ha dimostrato questo POC

- Un ciclo RxJS guidato da un timer può far andare avanti il gioco.
- La logica di rotazione e di wall kick è praticabile.
- Il problema principale è la separazione dell'architettura:
  stato della simulazione, stato del rendering e orchestrazione sono troppo legati.

## Perché un nuovo progetto

Ripartire da zero riduce gli attriti di migrazione e permette un'architettura a livelli migliore:

- nucleo del motore (indipendente dal framework),
- moduli con la logica dei singoli giochi,
- adattatori per rendering, temi e audio,
- applicazioni host (Angular o altre).
