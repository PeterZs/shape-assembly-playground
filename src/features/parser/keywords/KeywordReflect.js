import Keyword from './Keyword';
import VariableExisting from '../types/VariableExisting';
import Axis from '../types/Axis';

export default class KeywordReflect extends Keyword {
  constructor() {
    super([VariableExisting, Axis]);
  }

  static get name() {
    return 'reflect';
  }
}