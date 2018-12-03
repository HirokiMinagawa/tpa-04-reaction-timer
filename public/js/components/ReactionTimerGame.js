import { NUM_ROWS, NUM_COLS } from '../constants.js';
import { getRandomInt } from '../utils/math-utils.js';
import ReactionTimerGridView from './ReactionTimerGridView.js';

class ReactionTimerGame {
  constructor(activeCellNumbers) {
    this.view = null;
    this.activeCellRow = null;
    this.activeCellCol = null;
    this.clickOrder = null;
    this.activeCellNumbers = activeCellNumbers;
    this.outputOrder = [null, '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    this.currentStartTime = null;
    this.currentEndTime = null;
  }

  handleRoundStart() {
    this.clickOrder = 0;
    this.activeCellRow = {};
    this.activeCellCol = {};
    const delay = getRandomInt(500, 3000);
    for (let i = 0; i < this.activeCellNumbers; i++) {
      setTimeout(this.startCycle.bind(this, i), delay);
    }
  }

  startCycle(activeNum) {
    this.currentStartTime = new Date().getTime(); // milliseconds
    this.triggerRandomCell(activeNum);
  }

  triggerRandomCell(activeNum) {
    const randomRowIndex = getRandomInt(0, NUM_ROWS);
    const randomColIndex = getRandomInt(0, NUM_COLS);
    this.activeCellRow[activeNum] = randomRowIndex;
    this.activeCellCol[activeNum] = randomColIndex;
    if (this.view.activateCell(randomRowIndex, randomColIndex)) this.triggerRandomCell(activeNum);
  }

  handleActiveCellSelected(e) {
    this.clickOrder += 1;
    for (let i = 0; i < this.activeCellNumbers; i++) {
      if (e.target.id === `${this.activeCellRow[i]}:${this.activeCellCol[i]}`) {
        this.view.deactivateCell(this.activeCellRow[i], this.activeCellCol[i]);
        this.calculateTime();
      }
    }
  }

  calculateTime() {
    this.currentEndTime = new Date().getTime();
    console.log(`${this.outputOrder[this.clickOrder]} reaction : ${this.currentEndTime - this.currentStartTime}`);
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
