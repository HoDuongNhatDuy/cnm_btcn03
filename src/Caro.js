import React, {Component} from 'react';
import Board from './Board';
import './Caro.css';

class Caro extends React.Component {
    constructor(props) {
        super(props);

        let rows = this.props.rows || 30;
        let cols = this.props.cols || 30;

        let squares = new Array(rows).fill(null);
        for (let i = 0; i < rows; i++) {
            squares[i] = new Array(cols).fill(null);
        }

        this.state = {
            rows: rows,
            cols: cols,
            histories: [
                {
                    rows: rows,
                    cols: cols,
                    squares: squares,
                    stepNumber: 0,
                    currentX: -1,
                    currentY: -1,
                    isXNext: (this.props.isXNext || 1) == 1 ? true : false,
                }
            ],
            currentStep: 0,
            canPlay: true,
            winningSquares: [],
            isHistoryListSortAsc: true,
            selectedStep: -1
        };
    }

    GetStepOfSquare(x, y){
        let histories = this.state.histories;
        for (let i = 0; i < histories.length; i++){
            if (x == histories[i].currentX && y == histories[i].currentY)
                return histories[i].stepNumber;
        }

        return -1;
    }

    handleClick(x, y) {
        if (!this.state.canPlay) {
            return;
        }

        const histories = this.state.histories.slice(0, this.state.currentStep + 1);
        const current = histories[histories.length - 1];
        const squares = current.squares.slice();
        for (let i = 0; i < squares.length; i++){
            squares[i] = current.squares[i].slice();
        }

        if (squares[y][x]) {
            let selectedStep = this.GetStepOfSquare(x, y);
            this.setState({
                selectedStep: selectedStep
            });
            return;
        }


        const isXNext = current.isXNext;
        squares[y][x] = isXNext ? 'X' : 'O';

        let winningSquares = this.calculateWinner(x, y, squares);
        if (winningSquares) {
            this.setState({
                canPlay: false,
                winningSquares: winningSquares
            });
        }

        let new_step = this.state.currentStep + 1;

        let new_history_item = {
            rows: current.rows,
            cols: current.cols,
            squares: squares,
            stepNumber: new_step,
            currentX: x,
            currentY: y,
            isXNext: !isXNext
        };

        this.setState({
            histories: histories.concat(new_history_item),
            currentStep: new_step,
            selectedStep: -1
        });
    }

    calculateWinner(x, y, squares) {
        const numToWin = 5;

        if (x == -1 || y == -1 || !squares)
            return null;

        let currentPlayer = squares[y][x];

        // row checking ------------------------------------------------
        let count = 1; // last play is one, now we check for the rest four points
        let skipGoBack = true;
        let skipGoToward = true;
        let winningSquares = [{x: x, y:y}];
        let i = 1;
        for (i = 1; i < numToWin; i++) {
            if (x - i >= 0 && squares[y][x - i] == currentPlayer && skipGoBack) {
                count++;
                winningSquares.push({
                    x: x - i,
                    y: y
                })
            }
            else {
                skipGoBack = false;
            }

            if (x + i < this.state.cols && squares[y][x + i] == currentPlayer && skipGoToward) {
                count++;
                winningSquares.push({
                    x: x + i,
                    y: y
                })
            }
            else {
                skipGoToward = false
            }
        }
        if (count == numToWin)
            return winningSquares;

        // column checking ------------------------------------------------
        count = 1; // last play is one, now we check for the rest four points
        winningSquares = [{x: x, y:y}];
        skipGoBack = true;
        skipGoToward = true;
        for (i = 1; i < numToWin; i++) {
            if (y - i >= 0 && squares[y - i][x] == currentPlayer && skipGoBack) {
                count++;
                winningSquares.push({
                    x: x,
                    y: y - i
                })
            }
            else {
                skipGoBack = false;
            }

            if (y + i < this.state.rows && squares[y + i][x] == currentPlayer && skipGoToward) {
                count++;
                winningSquares.push({
                    x: x,
                    y: y + i
                })
            }
            else {
                skipGoToward = false
            }
        }
        if (count == numToWin)
            return winningSquares;

        // cross 1 checking -- top left -> bot right ------------------------------------------------
        count = 1; // last play is one, now we check for the rest four points
        winningSquares = [{x: x, y:y}];
        skipGoBack = true;
        skipGoToward = true;
        for (i = 1; i < numToWin; i++) {
            if (y - i >= 0 && x - i >= 0 && squares[y - i][x - i] == currentPlayer && skipGoBack) {
                count++;
                winningSquares.push({
                    x: x - i,
                    y: y - i
                });
            }
            else {
                skipGoBack = false;
            }

            if (y + i < this.state.rows && x + i < this.state.cols && squares[y + i][x + i] == currentPlayer && skipGoToward) {
                count++;
                winningSquares.push({
                    x: x + i,
                    y: y + i
                });
            }
            else {
                skipGoToward = false
            }
        }
        if (count == numToWin)
            return winningSquares;

        // cross 2 checking -- bot left -> top right ------------------------------------------------
        count = 1; // last play is one, now we check for the rest four points
        winningSquares = [{x: x, y:y}];
        skipGoBack = true;
        skipGoToward = true;
        for (i = 1; i < numToWin; i++) {
            if (y + i < this.state.rows && x - i >= 0 && squares[y + i][x - i] == currentPlayer && skipGoBack) {
                count++;
                winningSquares.push({
                    x: x - i,
                    y: y + i
                });
            }
            else {
                skipGoBack = false;
            }

            if (y - i >= 0 && x + i < this.state.cols && squares[y - i][x + i] == currentPlayer && skipGoToward) {
                count++;
                winningSquares.push({
                    x: x + i,
                    y: y - i
                });
            }
            else {
                skipGoToward = false
            }
        }
        if (count == numToWin)
            return winningSquares;

        return null;
    }

    jumpTo(step){
        if (step < this.state.histories.length - 1) { // is not the latest movement
            this.setState({
                currentStep: step,
                canPlay: true,
                winningSquares: []
            });
        }
        else {
            this.setState({
                currentStep: step,
            });
        }
    }

    reverseHistoryList(){
        this.setState({
            isHistoryListSortAsc: !this.state.isHistoryListSortAsc
        });
    }

    render() {
        let current_step = this.state.currentStep;
        let current_board = this.state.histories[current_step];

        let moves = this.state.histories.map((history, step) => {
            let selectedStep = this.state.selectedStep;
            let moveString = "Go to game start";
            if (history.currentX != -1 && history.currentY != -1){
                moveString = `Go to move #${step} (${history.currentX}, ${history.currentY})`
            }
            return (
                <li key={"move-" + history.currentX + "-" + history.currentY} className={selectedStep == step ? "selected" : "" }>
                    <button onClick={() => this.jumpTo(step)}>{moveString}</button>
                </li>
            );
        });
        if (this.state.isHistoryListSortAsc)
            moves = moves.reverse();

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        board={current_board}
                        winningSquares={this.state.winningSquares}
                        onClick={(x, y) => this.handleClick(x, y)}
                        isXNext={current_board.isXNext}
                    />
                </div>
                <div className="game-info">
                    <div className="sort-block">
                        <label className="switch">
                            <input type="checkbox" onClick={() => this.reverseHistoryList()} defaultChecked />
                            <span className="slider round"> </span>
                        </label>
                    </div>
                    <ul>{moves} </ul>
                </div>
            </div>
        );
    }
}

export default Caro;
