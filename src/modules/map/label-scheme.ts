import { getElementOrThrow } from '../helpers';
import { LabelScheme, loadSettings } from '../settings';

type ColorSchemeData = {max: number, color: string}[]

const rkiScheme: ColorSchemeData = [
  { max: 0,    color: '#ccf5c4' },
  { max: 5,    color: '#faf7c9' },
  { max: 25,   color: '#faee7d' },
  { max: 50,   color: '#fab133' },
  { max: 100,  color: '#d03523' },
  { max: 250,  color: '#921214' },
  { max: 500,  color: '#651212' },
  { max: 1000, color: '#d80182' }
];

const riskLayerScheme: ColorSchemeData = [
  { max: 0.01, color: '#2c83b9' },
  { max: 15,   color: '#80d38d' },
  { max: 25,   color: '#feffb1' },
  { max: 35,   color: '#feca81' },
  { max: 50,   color: '#f1894a' },
  { max: 100,  color: '#eb1a1f' },
  { max: 200,  color: '#ac1316' },
  { max: 350,  color: '#b275dd' },
  { max: 500,  color: '#5b189b' },
  { max: 1000, color: '#222222' }
];

export function colorForIncidence(sevenDaysInfectionsPer100k: number | undefined): string {
  return getColor(getSelectedColorScheme(), sevenDaysInfectionsPer100k);
}

export function renderColorScheme(): void {
  const renderBox = (color: string) =>  {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.classList.add('legend-color');
    return div;
  };
  const renderListEntry = (min: number | undefined, max: number, color: string) => {
    const div = document.createElement('div');
    div.textContent = (min !== undefined ? `> ${min}, ` : '') + `<= ${max}`;
    div.appendChild(renderBox(color));
    return div;
  };

  const elem = getElementOrThrow('.label-container');
  const colorScheme = getSelectedColorScheme();

  let min;
  for(const entry of colorScheme){
    elem.appendChild(renderListEntry(min, entry.max, entry.color));
    min = entry.max;
  }
}

function getSelectedColorScheme(){
  if(loadSettings().labelScheme === LabelScheme.RiskLayer) {
    return riskLayerScheme;
  }
  return rkiScheme;
}

function getColor(scheme: ColorSchemeData, incidence: number | undefined) {
  if (incidence === undefined) return '#fff';

  for(const entry of scheme) {
    if(incidence <= entry.max) {
      return entry.color;
    }
  }
  return '#fff';
}