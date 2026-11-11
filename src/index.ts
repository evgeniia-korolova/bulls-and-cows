import './ui/styles.scss';
import { mountApp } from './ui/app';

const appElement = document.querySelector<HTMLDivElement>('#app');

if (!appElement) {
  throw new Error('App root element not found');
}

mountApp(appElement);
