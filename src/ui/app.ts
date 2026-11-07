import { countPossibleSecrets } from '../countPossibleSecrets';
import { GAME_BASES, GameBase } from '../game/constants';
import { startGame } from '../game/startGame';
import { PlayingState, SetupState } from '../game/types';

export function mountApp(root: HTMLDivElement): void {
  const main = createElement('main', 'app');

  let selectedLength: number | null = null;
  let selectedBase: GameBase | null = null;
  let gameState: PlayingState | null = null;

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
    gameMessage.textContent = 'Your secret number is ready. Make your first guess.';

    const guessForm = createElement('form', 'guess-form');

    const guessLabel = createElement('label', 'guess-form__label');
    guessLabel.textContent = 'Your guess';

    const guessInput = createElement('input', 'guess-form__input');
    guessInput.type = 'text';
    guessInput.inputMode = 'text';
    guessInput.autocomplete = 'off';
    guessInput.maxLength = state.settings.length;
    guessInput.placeholder = 'Enter your guess';

    const submitButton = createElement('button', 'guess-form__submit');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit Guess';

    guessLabel.htmlFor = 'guess-input';
    guessInput.id = 'guess-input';

    guessForm.append(guessLabel, guessInput, submitButton);

    gameSection.replaceChildren(gameTitle, settingsInfo, gameMessage, guessForm);
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
