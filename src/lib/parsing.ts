import _ from 'lodash';

export default function number(value: string): number {
  const num = Number(value);
  if (_.isNaN(num)) {
    throw new Error(`expected a number: "${value}"`);
  }
  return num;
}
