class Stack {
    constructor() {
        this.items = [];
    }

    // Push operation
    push(element) {
        this.items.push(element);
    }

    // Pop operation
    pop() {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items.pop();
    }

    // Peek operation
    peek() {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items[this.items.length - 1];
    }

    // isEmpty operation
    isEmpty() {
        return this.items.length === 0;
    }

    // Size operation
    size() {
        return this.items.length;
    }

    // Print the stack 
    print() {
        console.log(this.items);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Constraints {
    /**
     * @param {string[]} colConstraintsHead 
     * @param {string[]} rowConstraintsHead 
     * @param {string[]} colConstraintsTail 
     * @param {string[]} rowConstraintsTail 
     */
    constructor(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail) {
        const removeDots = (letter) => letter == "..." ? "" : letter;
        this.colConstraintsHead = colConstraintsHead.map(removeDots); 
        this.rowConstraintsHead = rowConstraintsHead.map(removeDots); 
        this.colConstraintsTail = colConstraintsTail.map(removeDots); 
        this.rowConstraintsTail = rowConstraintsTail.map(removeDots); 
    }
}

/**
 * @param {string[]} colConstraintsHead 
 * @param {string[]} rowConstraintsHead 
 * @param {string[]} colConstraintsTail 
 * @param {string[]} rowConstraintsTail 
 * @param {string[][]} output 
 * @param {string[][][]} valids 
 * @param {(r: number, c: number, color: string) => Promise} onIteration
 * @returns {boolean}
 */
async function solve(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail, output, valids, onIteration) {
    console.log("column constraints - head: " + JSON.stringify(colConstraintsHead));
    console.log("row constraints - head: " + JSON.stringify(rowConstraintsHead));
    console.log("column constraints - tail: " + JSON.stringify(colConstraintsTail));
    console.log("row constraints - tail: " + JSON.stringify(rowConstraintsTail));
    const constraints = new Constraints(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail);
    // let state = [
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    // ];
    let state = output;

    /**
     * @param {number} r 
     * @param {number} c 
     */
    function recalculateValidsHeadTail(r, c) {
        if (constraints.colConstraintsHead[c] != "") {
            if (r == 0) {
                valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsHead[c] || letter == "X");
            } else if (r >= 3) {
                valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsHead[c]);
            } else if (r == 1) {
                if (state[0][c] == 'X') {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsHead[c] || letter == "X");
                } else if (state[0][c] != '') {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsHead[c]);
                }
            } else if (r == 2) {
                if (state[0][c] == 'X' && state[1][c] == 'X' ) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsHead[c] || letter == "X");
                } else if ((state[0][c] != '' && state[0][c] != 'X') || (state[1][c] != '' && state[1][c] != 'X')) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsHead[c]);
                }
            }
        }

        if (constraints.colConstraintsTail[c] != "") {
            if (r == 5) {
                valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsTail[c] || letter == "X");
            } else if (r < 3) {
                valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsTail[c]);
            } else if (r == 4) {
                if (state[5][c] == 'X') {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsTail[c] || letter == "X");
                } else if (state[5][c] != '') {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsTail[c]);
                }
            } else if (r == 3) {
                if (state[5][c] == 'X' && state[4][c] == 'X' ) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsTail[c]);
                } else if ((state[5][c] != '' && state[5][c] != 'X') || (state[4][c] != '' && state[4][c] != 'X')) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsTail[c]);
                }
            }
        }

        if (constraints.rowConstraintsHead[r] != "") {
            if (c == 0) {
                valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsHead[r] || letter == "X");
            } else if (c >= 3) {
                valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsHead[r]);
            } else if (c == 1) {
                if (state[r][0] == 'X') {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsHead[r] || letter == "X");
                } else if (state[r][0] != '') {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsHead[c]);
                }
            } else if (c == 2) {
                if (state[r][0] == 'X' && state[r][1] == 'X' ) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsHead[r]);
                } else if ((state[r][0] != '' && state[r][1] != 'X') || (state[r][1] != '' && state[r][1] != 'X')) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsHead[c]);
                }
            }
        }

        if (constraints.rowConstraintsTail[r] != "") {
            if (c == 5) {
                valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsTail[r] || letter == "X");
            } else if (c < 3) {
                valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsTail[r]);
            } else if (c == 4) {
                if (state[r][5] == 'X') {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsTail[r] || letter == "X");
                } else if (state[r][5] != '') {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsTail[c]);
                }
            } else if (c == 3) {
                if (state[r][5] == 'X' && state[r][4] == 'X' ) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsTail[r]);
                } else if ((state[r][5] != '' && state[r][5] != 'X') || (state[r][4] != '' && state[r][4] != 'X')) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsTail[c]);
                }
            }
        }
    }

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            valids[r][c] = ['A', 'B', 'C', 'D', 'X'];

            recalculateValidsHeadTail(r, c);

            if (valids[r][c].length <= 1) {
                console.log("invalid constraint: ", r, c);
                return false; // invalid constraint
            }
        }
    }

    /**
     * 
     * @returns {number}
     */
    function findMinValid() {
        let minValid = Number.MAX_VALUE;
        let found = null;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '') {
                    continue;
                }
                if (valids[r][c].length < minValid) {
                    minValid = valids[r][c].length;
                    found = [r, c];
                }
            }
        }
        return found;
    }

    function isInvalidState() {
        // at max one of each letter in each rows
        for (let r = 0; r < 6; r++) {
            let found = [];
            let spaceCount = 0;
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '') {
                    if (state[r][c] == 'X') {
                        if (spaceCount == 2) {
                            console.log('three spaces in a row:', r, c);
                            return true;
                        }
                        spaceCount++;
                    } else if (found.includes(state[r][c])) {
                        console.log('duplicate in row:', r, c);
                        return true;
                    }
                    found.push(state[r][c]);
                }
            }
        }
    
        // at max one of each letter in each columns
        for (let c = 0; c < 6; c++) {
            let found = [];
            let spaceCount = 0;
            for (let r = 0; r < 6; r++) {
                if (state[r][c] != '') {
                    if (state[r][c] == 'X') {
                        if (spaceCount == 2) {
                            console.log('three spaces in a column:', r, c);
                            return true;
                        }
                        spaceCount++;
                    } else if (found.includes(state[r][c])) {
                        console.log('duplicate in column:', r, c);
                        return true;
                    }
                    found.push(state[r][c]);
                }
            }
        }
    
        // rowConstraintsHead
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.rowConstraintsHead[r]) {
                    console.log('rowConstraintsHead:', r, c);
                    return true;
                }
            }
        }
        // rowConstraintsTail
        for (let r = 6; r >= 0; r--) {
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.rowConstraintsTail[r]) {
                    console.log('rowConstraintsTail:', r, c);
                    return true;
                }
            }
        }
    
        // colConstraintsHead
        for (let c = 0; c < 6; c++) {
            for (let r = 0; r < 6; r++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.colConstraintsHead[c]) {
                    console.log('colConstraintsHead:', r, c);
                    return true;
                }
            }
        }
        // colConstraintsTail
        for (let c = 6; c >= 0; c--) {
            for (let r = 0; r < 6; r++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.colConstraintsTail[c]) {
                    console.log('colConstraintsTail:', r, c);
                    return true;
                }
            }
        }

        console.log("VALID!!!");
        return false;
    }

    /**
     * @param {number} r
     * @param {number} c
     * @param {string} letter
     */
    function setLetter(r, c, letter) {
        state[r][c] = letter;
        for (let row = 0; row < 6; row++) {
            if (row == r) continue;
            recalculateValids(row, c);
        }
        for (let col = 0; col < 6; col++) {
            if (col == c) continue;
            recalculateValids(r, col);
        }
    }

    /**
     * @param {number} r
     * @param {number} c
     */
    function unsetLetter(r, c) {
        state[r][c] = '';
        for (let row = 0; row < 6; row++) {
            if (row == r) continue;
            recalculateValids(row, c);
        }
        for (let col = 0; col < 6; col++) {
            if (col == c) continue;
            recalculateValids(r, col);
        }
        recalculateValids(r, c);
    }

    /**
     * Ignores X
     * @param {number} r
     * @param {number} c
     */
    function recalculateValids(r, c) {
        valids[r][c] = ['A', 'B', 'C', 'D', 'X'];
        let foundEmptyInRow = false;
        for (let r2 = 0; r2 < 6; r2++) {
            if (r2 == r) continue;
            if (state[r2][c] == 'X') {
                if (foundEmptyInRow) {
                    valids[r][c] = valids[r][c].filter(l => l != 'X');
                } else {
                    foundEmptyInRow = true;
                }
            } else if (state[r2][c] != '') {
                valids[r][c] = valids[r][c].filter(l => l != state[r2][c]);
            }
        }
        
        let foundEmptyInCol = false;
        for (let c2 = 0; c2 < 6; c2++) {
            if (c2 == c) continue;
            if (state[r][c2] == 'X') {
                if (foundEmptyInCol) {
                    valids[r][c] = valids[r][c].filter(l => l != 'X');
                } else {
                    foundEmptyInCol = true;
                }
            } else if (state[r][c2] != '') {
                valids[r][c] = valids[r][c].filter(l => l != state[r][c2]);
            }
        }
        recalculateValidsHeadTail(r, c);
    }

    /**
     * @param {number} depth
     */
    async function backtrack(depth) {
        console.log('depth:', depth)
        let next = findMinValid();
        if (next === null) {
            console.log("no more valid next");
            return depth == 36;
        }
        let [r, c] = next;
        if (valids[r][c].length == 0) {
            console.log("found invalid cell: ", r, c);
            await onIteration(r, c, 'red');
            return false;
        }
        for (let letter of valids[r][c]) {
            setLetter(r, c, letter);
            await onIteration(r, c, 'yellow');
            if (!(await backtrack(depth + 1))) {
                console.log("back tracking!");
                unsetLetter(r, c);
                await onIteration(r, c, 'red');
            } else {
                console.log("valid!");
                return true;
            }
        }
        return false;
    }

    if (await backtrack(0)) {
        // for (let r = 0; r < 6; r++) {
        //     for (let c = 0; c < 6; c++) {
        //         output[r][c] = state[r][c];
        //     }
        // }
        console.log('backtrack success:')
        return true;
    } else {
        console.log('backtrack failed:')
        return false;
    }
}

