export function mountApp(root: HTMLDivElement): void {
  const main = createElement('main', 'app');

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
