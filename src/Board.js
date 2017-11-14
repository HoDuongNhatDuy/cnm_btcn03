import React, {Component} from 'react';
import './Board.css';

function Square(props) {
    let classNames = ["square"];
    if (props.isWinningSquare)
        classNames.push("win");

    if (props.value) {
        if (props.value == "X")
            classNames.push("x-square");
        else if (props.value == "O")
            classNames.push("o-square");
        else
            classNames.push("normal-cursor");
    }
    else if (props.isXNext)
        classNames.push("x-cursor");
    else if (!props.isXNext)
        classNames.push("o-cursor");
    return (
        <button className={classNames.join(" ")} onClick={props.onClick}>
        </button>
    );
}

class Board extends React.Component {
    isWinningSquare(x, y, winningSquares){
        for (let i = 0; i < winningSquares.length; i++){
            if (winningSquares[i].x == x && winningSquares[i].y == y)
                return true;
        }
        return false;
    }
    renderSquare(x, y, value) {
        let isWinningSquare = this.isWinningSquare(x, y, this.props.winningSquares);
        return (
            <Square
                key={"square-" + x + "-" + y }
                value={value}
                isXNext={this.props.isXNext}
                isWinningSquare={isWinningSquare}
                onClick={() => this.props.onClick(x, y)}
            />
        );
    }

    renderRow(y, rowContent) {
        return (
            <div key={"row-" + y} className="board-row">
                {rowContent}
            </div>
        );
    }

    render() {
        let board = [];

        for (let y = 0; y < this.props.board.rows; y++) {
            let squares = [];
            for (let x = 0; x < this.props.board.cols; x++) {
                squares.push(this.renderSquare(x, y, this.props.board.squares[y][x]));
            }
            board.push(this.renderRow(y, squares));
        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

export default Board;
