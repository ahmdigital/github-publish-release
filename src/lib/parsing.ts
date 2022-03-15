import { isNaN } from 'lodash/fp';

export default function number(value: string): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`expected a number: "${value}"`);
  }
  return num;
}
