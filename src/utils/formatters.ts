import { Unit } from '../api';

export function currencyParser(value: string | undefined): number {
  const parsed = parseInt(value?.replace(/[^0-9]/g, '') ?? '');
  if (Number.isNaN(parsed)) return 0;
  return parsed;
}

export function currencyFormatter(
  value: string | number | undefined,
  position: 'right' | 'left' = 'right'
): string {
  const fmt = value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return position === 'left' ? `Gs. ${fmt}` : `${fmt} Gs.`;
}

export function unitFormatter(
  value: number | undefined,
  unit?: Unit | undefined,
  position?: 'left' | 'right'
): string {
  if (position == 'right') {
    switch (unit) {
      case 'KG':
        return `${value?.toFixed(3)} KG`;
      case 'L':
        return `${value?.toFixed(3)}  L`;
      case 'UNITS':
        return `${value?.toFixed(3)} Un`;
      default:
        return `${value?.toFixed(3)}   `;
    }
  }
  if (position == 'left') {
    switch (unit) {
      case 'KG':
        return `KG  ${value?.toFixed(3)}`;
      case 'L':
        return `L  ${value?.toFixed(3)}`;
      case 'UNITS':
        return `Un ${value?.toFixed(3)}`;
      default:
        return `${value?.toFixed(3)}`;
    }
  }
  return '';
}

export function unitMapper(
  unit?: Unit | undefined,
  isPlural?: boolean
): string {
  if (!isPlural) {
    switch (unit) {
      case 'KG':
        return `Kilogramo`;
      case 'L':
        return `Litro`;
      case 'UNITS':
        return `Unidad`;
      default:
        return ``;
    }
  } else {
    switch (unit) {
      case 'KG':
        return `Kilogramos`;
      case 'L':
        return `Litros`;
      case 'UNITS':
        return `Unidad`;
      default:
        return ``;
    }
  }
}
