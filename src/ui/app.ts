import { countPossibleSecrets } from '../countPossibleSecrets';
import { abandonGame } from '../game/abandonGame';
import { GAME_BASES, GameBase } from '../game/constants';
import { getLeaderboard } from '../game/getLeaderboard';
import { resetGame } from '../game/resetGame';
import { startGame } from '../game/startGame';
import { submitGuess } from '../game/submitGuess';
import {
  GameAttempt,
  GameResult,
  GuessValidationError,
  LostState,
  PlayingState,
  SetupState,
  WonState,
} from '../game/types';
import { getGuessValidationError, isValidGuess } from '../isValidGuess';
import { loadGameData, saveGameData } from '../storage/storage';
import { StoredGameData } from '../storage/types';

export function mountApp(root: HTMLDivElement): void {
  const main = createElement('main', 'app');

  let selectedLength: number | null = null;
  let selectedBase: GameBase | null = null;
  let gameState: PlayingState | WonState | LostState | null = null;

  let gameResults: readonly GameResult[] = loadGameData()?.results ?? [];

  function saveGameResult(result: GameResult): void {
    gameResults = [...gameResults, result];
    const leaders = getLeaderboard(gameResults);

    const data: StoredGameData = {
      version: 1,
      settings: result.settings,
      results: gameResults,
    };

    gameResults = leaders;
    saveGameData({ data });
  }

  const header = createElement('header', 'app__header');
  const title = createElement('h1', 'app__title');
  title.textContent = 'Bulls & Cows';

  const subtitle = createElement('p', 'app__subtitle');
  subtitle.textContent = 'A little logic under the night sky';

  header.append(title, subtitle);

  const content = createElement('div', 'app__content');

  const gameSection = createElement('section', 'game');
  gameSection.setAttribute('aria-label', 'Game');

  const setupTitle = createElement('h2', 'game__title');
  setupTitle.textContent = 'Game Setup';

  const setupStatus = createElement('p', 'game__status');
  setupStatus.textContent = 'Choose your settings';

  const setupForm = createElement('form', 'setup-form');

  const lengthFieldset = createElement('fieldset', 'setup-form__group');
  const lengthLegend = createElement('legend', 'setup-form__legend');
  lengthLegend.textContent = 'Number of digits';

  lengthFieldset.append(lengthLegend);

  for (const length of [2, 3, 4, 5, 6]) {
    const label = createElement('label', 'setup-form__option');
    const input = createElement('input');

    input.type = 'radio';
    input.name = 'length';
    input.value = String(length);
    input.id = `length-${length}`;

    label.htmlFor = input.id;
    label.append(input, document.createTextNode(String(length)));

    lengthFieldset.append(label);
  }

  const baseFieldset = createElement('fieldset', 'setup-form__group');
  const baseLegend = createElement('legend', 'setup-form__legend');
  baseLegend.textContent = 'Number base';

  baseFieldset.append(baseLegend);

  for (const base of [2, 8, 10, 16]) {
    const label = createElement('label', 'setup-form__option');
    const input = createElement('input');

    input.type = 'radio';
    input.name = 'base';
    input.value = String(base);
    input.id = `base-${base}`;

    label.htmlFor = input.id;
    label.append(input, document.createTextNode(String(base)));

    baseFieldset.append(label);
  }

  const combinationsInfo = createElement('p', 'setup-form__info');
  combinationsInfo.textContent = 'Select your settings to see possible combinations';

  const startButton = createElement('button', 'setup-form__submit');
  startButton.type = 'submit';
  startButton.textContent = 'Start Game';
  startButton.disabled = true;

  function updateSetupForm(): void {
    const lengthInputs = lengthFieldset.querySelectorAll<HTMLInputElement>('input[name="length"]');

    for (const input of lengthInputs) {
      const length = Number(input.value);
      input.disabled = selectedBase !== null && length > selectedBase;

      if (input.disabled && input.checked) {
        input.checked = false;
        selectedLength = null;
      }
    }

    const isValid = selectedLength !== null && selectedBase !== null;

    startButton.disabled = !isValid;

    if (selectedLength === null && selectedBase === null) {
      setupStatus.textContent = 'Choose your settings';
      combinationsInfo.textContent = 'Select your settings to see possible combinations';
      return;
    }

    if (selectedLength === null) {
      setupStatus.textContent = 'Choose number of digits';
      return;
    }

    if (selectedBase === null) {
      setupStatus.textContent = 'Choose number base';
      return;
    }

    setupStatus.textContent = 'Ready to play!';

    combinationsInfo.textContent = `Possible combinations: ${countPossibleSecrets(selectedLength, selectedBase).toLocaleString()}`;
  }

  function renderPlayingState(state: PlayingState): void {
    const gameTitle = createElement('h2', 'game__title');
    gameTitle.textContent = 'Game';

    const settingsInfo = createElement('p', 'game__settings');
    settingsInfo.textContent = `${state.settings.length} digits · Base ${state.settings.base}`;

    const gameMessage = createElement('p', 'game__message');
    gameMessage.textContent =
      state.history.length === 0 ? 'Make your first guess.' : 'Not quite! Try another guess.';

    const guessForm = createElement('form', 'guess-form');

    const historySection = renderHistory(state.history);

    const guessLabel = createElement('label', 'guess-form__label');
    guessLabel.textContent = 'Your guess';

    const guessInput = createElement('input', 'guess-form__input');
    const guessError = createElement('p', 'guess-form__error');
    guessInput.type = 'text';
    guessInput.inputMode = 'text';
    guessInput.autocomplete = 'off';
    guessInput.maxLength = state.settings.length;
    guessInput.placeholder = 'Enter your guess';

    guessError.id = 'guess-error';
    guessError.setAttribute('aria-live', 'polite');
    guessInput.setAttribute('aria-describedby', guessError.id);

    const submitButton = createElement('button', 'guess-form__submit');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit Guess';
    submitButton.disabled = true;

    const giveUpButton = createElement('button', 'guess-form__give-up');
    giveUpButton.type = 'button';
    giveUpButton.textContent = 'Give Up';

    guessLabel.htmlFor = 'guess-input';
    guessInput.id = 'guess-input';

    const guessActions = createElement('div', 'guess-form__actions');
    guessActions.append(submitButton, giveUpButton);

    guessForm.append(guessLabel, guessInput, guessActions, guessError);

    guessInput.addEventListener('input', () => {
      const guess = guessInput.value;

      if (guess.length === 0) {
        guessError.textContent = '';
        guessInput.setAttribute('aria-invalid', 'false');
        submitButton.disabled = true;
        return;
      }

      const validationError = getGuessValidationError(
        guess,
        state.settings.length,
        state.settings.base,
      );

      const errorMessages: Record<GuessValidationError, string> = {
        'invalid-length': `Enter exactly ${state.settings.length} characters.`,
        'invalid-digit': `Use only digits allowed in base ${state.settings.base}.`,
        'duplicate-digits': 'Each digit must be unique.',
      };

      guessError.textContent = validationError === null ? '' : errorMessages[validationError];

      guessInput.setAttribute('aria-invalid', String(validationError !== null));

      submitButton.disabled = validationError !== null;
    });

    guessForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (gameState === null || gameState.status !== 'playing') {
        return;
      }

      const guess = guessInput.value;

      if (!isValidGuess(guess, gameState.settings.length, gameState.settings.base)) {
        return;
      }

      gameState = submitGuess({
        state: gameState,
        guess,
      });

      if (gameState.status === 'won') {
        saveGameResult(gameState.result);
        renderLeaderboard();
        renderWonState(gameState);
        return;
      }

      renderPlayingState(gameState);
    });

    giveUpButton.addEventListener('click', () => {
      if (gameState === null || gameState.status !== 'playing') {
        return;
      }

      if (!window.confirm('Are you sure you want to give up?')) {
        return;
      }

      const secret = gameState.secret;

      gameState = abandonGame({ state: gameState });

      saveGameResult(gameState.result);
      renderLeaderboard();
      renderLostState(gameState, secret);
    });

    gameSection.replaceChildren(gameTitle, settingsInfo, gameMessage, guessForm, historySection);
  }

  function renderWonState(state: WonState): void {
    const result = state.result;
    const secret = result.attempts.at(-1)?.guess;

    const gameTitle = createElement('h2', 'game__title');
    gameTitle.textContent = 'You got it! 🎉';

    const secretMessage = createElement('p', 'game__message');
    secretMessage.textContent = `The secret number was ${secret}.`;

    const attemptsInfo = createElement('p', 'game__result-info');
    attemptsInfo.textContent = `Attempts: ${result.attempts.length}`;

    const durationInfo = createElement('p', 'game__result-info');
    durationInfo.textContent = `Time: ${formatDuration(result.duration)}`;

    const historySection = renderHistory(result.attempts);

    const newGameButton = createElement('button', 'game__new-game');
    newGameButton.type = 'button';
    newGameButton.textContent = 'Start New Game';

    newGameButton.addEventListener('click', () => {
      const setupState = resetGame({ state });

      selectedLength = setupState.settings.length;
      selectedBase = setupState.settings.base;

      const lengthInputs =
        lengthFieldset.querySelectorAll<HTMLInputElement>('input[name="length"]');

      for (const input of lengthInputs) {
        input.checked = Number(input.value) === selectedLength;
      }

      const baseInputs = baseFieldset.querySelectorAll<HTMLInputElement>('input[name="base"]');

      for (const input of baseInputs) {
        input.checked = Number(input.value) === selectedBase;
      }

      gameState = null;

      gameSection.replaceChildren(setupTitle, setupStatus, setupForm);

      updateSetupForm();
    });

    gameSection.replaceChildren(
      gameTitle,
      secretMessage,
      attemptsInfo,
      durationInfo,
      historySection,
      newGameButton,
    );
  }

  function renderLostState(state: LostState, secret: string): void {
    const result = state.result;

    const gameTitle = createElement('h2', 'game__title');
    gameTitle.textContent = 'Game Over. You gave up!';

    const secretMessage = createElement('p', 'game__message');
    secretMessage.textContent = `The secret number was ${secret}.`;

    const attemptsInfo = createElement('p', 'game__result-info');
    attemptsInfo.textContent = `Attempts: ${result.attempts.length}`;

    const durationInfo = createElement('p', 'game__result-info');
    durationInfo.textContent = `Time: ${formatDuration(result.duration)}`;

    const historySection = renderHistory(result.attempts);

    const newGameButton = createElement('button', 'game__new-game');
    newGameButton.type = 'button';
    newGameButton.textContent = 'Start New Game';

    newGameButton.addEventListener('click', () => {
      const setupState = resetGame({ state });

      selectedLength = setupState.settings.length;
      selectedBase = setupState.settings.base;

      const lengthInputs =
        lengthFieldset.querySelectorAll<HTMLInputElement>('input[name="length"]');

      for (const input of lengthInputs) {
        input.checked = Number(input.value) === selectedLength;
      }

      const baseInputs = baseFieldset.querySelectorAll<HTMLInputElement>('input[name="base"]');

      for (const input of baseInputs) {
        input.checked = Number(input.value) === selectedBase;
      }

      gameState = null;

      gameSection.replaceChildren(setupTitle, setupStatus, setupForm);

      updateSetupForm();
    });

    gameSection.replaceChildren(
      gameTitle,
      secretMessage,
      attemptsInfo,
      durationInfo,
      historySection,
      newGameButton,
    );
  }

  function renderHistory(history: readonly GameAttempt[]): HTMLElement {
    const historySection = createElement('section', 'history');

    const historyTitle = createElement('h3', 'history__title');
    const historyContent = createElement('div', 'history__content');

    const historyTable = createElement('table', 'history__table');

    const tableHead = createElement('thead', 'history__head');
    const headerRow = createElement('tr');

    const headers = ['Guess', 'Bulls', 'Cows'];

    for (const header of headers) {
      const cell = createElement('th');
      cell.scope = 'col';
      cell.textContent = header;
      headerRow.append(cell);
    }

    tableHead.append(headerRow);

    const tableBody = createElement('tbody', 'history__body');

    for (const attempt of [...history].reverse()) {
      const row = createElement('tr', 'history__row');

      const guessCell = createElement('th');
      guessCell.scope = 'row';
      guessCell.textContent = attempt.guess;

      const bullsCell = createElement('td');
      bullsCell.textContent = String(attempt.bulls);

      const cowsCell = createElement('td');
      cowsCell.textContent = String(attempt.cows);

      row.append(guessCell, bullsCell, cowsCell);
      tableBody.append(row);
    }

    historyTable.append(tableHead, tableBody);
    historyTitle.textContent = 'Guess History';

    historyContent.append(historyTable);
    historySection.append(historyTitle, historyContent);

    return historySection;
  }

  function renderLeaderboard(): void {
    const leaders = getLeaderboard(gameResults);

    if (leaders.length === 0) {
      leaderboardSection.replaceChildren(leaderboardTitle, emptyMessage);
      return;
    }

    const table = createElement('table', 'leaderboard__table');

    const tableHead = createElement('thead');
    const headerRow = createElement('tr');

    for (const heading of ['Rank', 'Digits', 'Base', 'Attempts', 'Time']) {
      const cell = createElement('th');
      cell.scope = 'col';
      cell.textContent = heading;

      headerRow.append(cell);
    }

    tableHead.append(headerRow);

    const tableBody = createElement('tbody');
    leaders.forEach((result, index) => {
      const row = createElement('tr', 'leaderboard__row');

      const rankCell = createElement('th');
      rankCell.scope = 'row';
      rankCell.textContent = String(index + 1);

      const digitsCell = createElement('td');
      digitsCell.textContent = String(result.settings.length);

      const baseCell = createElement('td');
      baseCell.textContent = String(result.settings.base);

      const attemptsCell = createElement('td');
      attemptsCell.textContent = String(result.attempts.length);

      const timeCell = createElement('td');
      timeCell.textContent = formatDuration(result.duration);

      row.append(rankCell, digitsCell, baseCell, attemptsCell, timeCell);
      tableBody.append(row);
    });

    table.append(tableHead, tableBody);
    leaderboardSection.replaceChildren(leaderboardTitle, table);
  }

  function formatDuration(duration: number): string {
    const totalSeconds = Math.floor(duration / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  for (const input of lengthFieldset.querySelectorAll<HTMLInputElement>('input[name="length"]')) {
    input.addEventListener('change', () => {
      selectedLength = Number(input.value);
      updateSetupForm();
    });
  }

  for (const input of baseFieldset.querySelectorAll<HTMLInputElement>('input[name="base"]')) {
    input.addEventListener('change', () => {
      const base = Object.values(GAME_BASES).find((value) => value === Number(input.value));

      if (base !== undefined) {
        selectedBase = base;
        updateSetupForm();
      }
    });
  }

  setupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (selectedLength === null || selectedBase === null) {
      return;
    }

    const setupState: SetupState = {
      status: 'setup',
      settings: {
        length: selectedLength,
        base: selectedBase,
      },
    };

    gameState = startGame(setupState);
    renderPlayingState(gameState);
  });

  setupForm.append(lengthFieldset, baseFieldset, combinationsInfo, startButton);

  gameSection.append(setupTitle, setupStatus, setupForm);

  const leaderboardSection = createElement('section', 'leaderboard');
  leaderboardSection.setAttribute('aria-label', 'Leaderboard');

  const leaderboardTitle = createElement('h2', 'leaderboard__title');
  leaderboardTitle.textContent = 'Leaderboard';

  const emptyMessage = createElement('p', 'leaderboard__empty');
  emptyMessage.textContent = 'No leaders yet. Be the first to win!';

  leaderboardSection.append(leaderboardTitle, emptyMessage);

  renderLeaderboard();

  content.append(gameSection, leaderboardSection);
  main.append(header, content);

  root.replaceChildren(main);
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  return element;
}
