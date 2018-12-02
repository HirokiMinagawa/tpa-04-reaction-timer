import { NUM_ROWS, NUM_COLS } from '../constants.js';
import { getRandomInt } from '../utils/math-utils.js';
import ReactionTimerGridView from './ReactionTimerGridView.js';

class ReactionTimerGame {
  constructor() {
    this.view = null;
    this.activeCellRow1 = null;
    this.activeCellCol1 = null;
    this.activeCellRow2 = null;
    this.activeCellCol2 = null;
    this.clickOrder = null;
    this.currentStartTime = null;
    this.currentEndTime = null;
  }

  handleRoundStart() {
    this.clickOrder = 0;
    const delay = getRandomInt(500, 3000);
    setTimeout(this.startCycle.bind(this, 1), delay);
    setTimeout(this.startCycle.bind(this, 2), delay);
  }

  startCycle(activeNum) {
    this.currentStartTime = new Date().getTime(); // milliseconds
    this.view.deactivateCell(this['activeCellRow' + activeNum], this['activeCellCol' + activeNum]);
    this.triggerRandomCell(activeNum);
  }

  triggerRandomCell(activeNum) {
    const randomRowIndex = getRandomInt(0, NUM_ROWS);
    const randomColIndex = getRandomInt(0, NUM_COLS);
    this['activeCellRow' + activeNum] = randomRowIndex;
    this['activeCellCol' + activeNum] = randomColIndex;
    this.view.activateCell(randomRowIndex, randomColIndex);
  }

  handleActiveCellSelected(e) {
    this.clickOrder += 1
    switch (e.target.id) {

      case `${this.activeCellRow1}:${this.activeCellCol1}`:
      this.view.deactivateCell(this.activeCellRow1, this.activeCellCol1);
      this.calculateTime();
      break;

      case `${this.activeCellRow2}:${this.activeCellCol2}`:
      this.view.deactivateCell(this.activeCellRow2, this.activeCellCol2);
      this.calculateTime();
      break;
    }
  }

  calculateTime() {
    this.currentEndTime = new Date().getTime();
    console.log(`${this.clickOrder === 1 ? '1st' : '2nd'} reaction : ${this.currentEndTime - this.currentStartTime}`);
  }

  init() {
    this.view = new ReactionTimerGridView();

    this.view.registerActiveCellSelectedCallback(this.handleActiveCellSelected.bind(this));
    this.view.registerRoundStartCallback(this.handleRoundStart.bind(this));

    this.view.initDomAndListeners();
    this.view.drawGrid();
  }
}

export default ReactionTimerGame;
