var size = 35; // Size of the hexagons
var hexWidth = size * Math.sqrt(3); // Width of the hexagons
var hexHeight = size * 2; // Height of the hexagons

// Number of maximum rows and columns in the hexagonal grid
const rows = 9; const cols = 9; 

// Positions of each hexagons in the pieces
var hexagonX = null; var hexagonY = null;

/* Array to store information about the grid: 
 * occupied: if an hexagon in the grid is already occupied by an hexagon of a piece
 * id: the unique id of each hexagon
 * x and y: coordinates of each hexagon
*/
var grid = Array.from(Array(rows), () => Array(cols).fill(false));

// Variable to keep the value of the score of the game
var score = 0;

// Variable to keep the number of failed attempts to place a piece in the grid
var attempts = 0;

// Reinitiate the game in case the button "New game" is clicked
document.getElementById('newGame').addEventListener('click', function(){location.reload();});

// Display the credits
document.getElementById('credits').addEventListener('click', function(){alert("Hex FRVR\nMade by: Lara Haya Santiago\nUniPi 2024");});

const PIECES = // Properties of each piece
[
    { id: "0: single", hexagons: [[0, 0]], color: "brown" },

    { id: "1: horizontal", hexagons: [[0, 0], [0, 1], [0, 2], [0, 3]], color: "chocolate" },
    { id: "2: vertical left", hexagons: [[3, 0], [2, 0], [1, 0], [0, 0]], color: "orange" },
    { id: "3: vertical right", hexagons: [[0, 0], [1, 1], [2, 2], [3, 3]], color: "coral" },

    { id: "4: 3 + 1 horizontal (right top)", hexagons: [[1, 0], [1, 1], [1, 2], [0, 0]], color: "red" },
    { id: "5: 3 + 1 horizontal (left top)", hexagons: [[1, 0], [1, 1], [1, 2], [0, 1]], color: "crimson" },
    { id: "6: 3 + 1 horizontal (right bottom)", hexagons: [[1, 0], [1, 1], [1, 2], [2, 1]], color: "firebrick" },
    { id: "7: 3 + 1 horizontal (left bottom)", hexagons: [[1, 0], [1, 1], [1, 2], [2, 2]], color: "maroon" },

    { id: "8: 3 + 1 vertical left (right top)", hexagons: [[1, 2], [2, 1], [1, 1], [0, 1]], color: "lightpink" },
    { id: "9: 3 + 1 vertical left (right bottom)", hexagons: [[2, 2], [2, 1], [1, 1], [0, 1]], color: "hotpink" },
    { id: "10: 3 + 1 vertical left (left top)", hexagons: [[0, 0], [2, 1], [1, 1], [0, 1]], color: "fuchsia" },
    { id: "11: 3 + 1 vertical left (left bottom)", hexagons: [[1, 0], [2, 1], [1, 1], [0, 1]], color: "deeppink" },

    { id: "12: 3 + 1 vertical right (left bottom)", hexagons: [[0, 0], [1, 1], [2, 2], [0, 1]], color: "slateblue" },
    { id: "13: 3 + 1 vertical right (left bottom)", hexagons: [[0, 0], [1, 1], [2, 2], [1, 2]], color: "rebeccapurple" },
    { id: "14: 3 + 1 vertical right (left bottom)", hexagons: [[0, 0], [1, 1], [2, 2], [1, 0]], color: "darkorchid" },
    { id: "15: 3 + 1 vertical right (left bottom)", hexagons: [[0, 0], [1, 1], [2, 2], [2, 1]], color: "indigo" },

    { id: "16: diamond vertical", hexagons: [[0, 0], [1, 1], [1, 0], [2, 1]], color: "chartreuse" },
    { id: "17: diamond left", hexagons: [[0, 0], [0, 1], [1, 0], [1, 1]], color: "springgreen" },
    { id: "18: diamond right", hexagons: [[0, 0], [0, 1], [1, 1], [1, 2]], color: "darkgreen" },

    { id: "19: flower top", hexagons: [[0, 0], [0, 1], [1, 0], [1, 2]], color: "skyblue" },
    { id: "20: flower bottom", hexagons: [[1, 0], [1, 2], [2, 1], [2, 2]], color: "turquoise" },
    { id: "21: flower left up", hexagons: [[0, 1], [0, 0], [1, 0], [2, 1]], color: "dodgerblue" },
    { id: "22: flower right down", hexagons: [[0, 1], [1, 2], [2, 2], [2, 1]], color: "cornflowerblue" },
    { id: "23: flower right up", hexagons: [[0, 1], [0, 0], [2, 2], [1, 2]], color: "blue" },
    { id: "24: flower left down", hexagons: [[0, 0], [1, 0], [2, 1], [2, 2]], color: "midnightblue" },
];

function createHexagon() 
{
    var hexagon = document.createElement("div");
    hexagon.className = "hexagon";
    hexagon.id = Math.random().toString(36).substring(2, 9);
    return hexagon;
}

function generateHexagonalGrid() 
{
    var offset = 4;
    var hexagonCounts = [5, 6, 7, 8, 9, 8, 7, 6, 5]; // Num of hexagons in each row

    for (var i = 0; i < hexagonCounts.length; i++) 
    {
        var cols = hexagonCounts[i];

        for (var j = 0; j < cols; j++) 
        {
            var hexagon = createHexagon();
            var x = j * (hexWidth) + ((hexWidth / 2) * offset) + 10;
            var y = i * hexHeight * 0.65;

            hexagon.style.top = y + "px";
            hexagon.style.left = x + "px";
            hexagon.style.backgroundColor = "lightgrey";
            document.getElementById("hexagonArea").appendChild(hexagon);

            grid[i][j] = {occupied: false, id: null,
                x: Math.floor(hexagon.getBoundingClientRect().left - hexagon.parentElement.getBoundingClientRect().left), 
                y: Math.floor(hexagon.getBoundingClientRect().top - hexagon.parentElement.getBoundingClientRect().top)};
        }

        if (i < 4) offset--;
        else offset++;
    }

    // Remove empty rows
    for (var row = 0; row < grid.length; row++) 
        grid[row] = grid[row].filter(col => col); 

    // Set the inital score
    setScore(0);
}

function setScore(newScore) // Update the score
{
    score += newScore;
    document.getElementById("score").textContent = "Score: " + score;
}

function generatePiece(number, fixedArea)
{
    var piece = PIECES[number].hexagons;
    var color = PIECES[number].color;
    var movingArea = document.createElement("div"); // Create an area inside of each area to move the piece

    movingArea.id = "id-fixed" + fixedArea + Math.random().toString(36).substring(2, 9);
    movingArea.draggable = true;
    movingArea.addEventListener('dragstart', function(event) 
    {
        const data = 
        {
            movingAreaId: movingArea.id,
            fixedAreaId: fixedArea
        };
        event.dataTransfer.setData('text', JSON.stringify(data));
    });
    
    for(var row = 0; row<piece.length; row++)
    {
        var hexagon = createHexagon();
        hexagon.style.backgroundColor = color;
        var x = null;
        var y = piece[row][0] * hexHeight * 0.65;

        switch(number)
        {
            case 0: // single
                x = hexagon.offsetLeft;
                break;
            
            case 1: // horizontal
                x = row * hexWidth;
                y = hexagon.offsetTop;
                break;
            case 2: // vertical pointing right up
            case 3: // vertical pointing left up
                x = row * hexWidth/2;
                break;
            
            case 4: // 3 + 1 horizontal (right top)
            case 5: // 3 + 1 horizontal (left top)
            case 6: // 3 + 1 horizontal (right bottom)
            case 7: // 3 + 1 horizontal (left bottom)
                x = piece[row][1] * hexWidth;

                if(row == 3) // Only the last hexagon is moved
                {
                    if(number == 4 || number == 5)
                        x += hexWidth/2;
                    else
                        x -= hexWidth/2;
                }
                break;
            
            case 8: // 3 + 1 vertical left (right top)
            case 9: // 3 + 1 vertical left (right bottom)
            case 10: // 3 + 1 vertical left (left top)
            case 11: // 3 + 1 vetical left (left bottom)
                x = piece[row][1] * hexWidth + (hexWidth/2 * row);

                if(row == 0)
                {
                    if(number == 8 || number == 11)
                        x += hexWidth;
                    else if(number == 9)
                        x += hexWidth/2;
                    else if(number == 10)
                        x += hexWidth/2 * 3;
                }
                break;
            
            case 12: // 3 + 1 vertical right (right top)
            case 13: // 3 + 1 vertical right (right bottom)
            case 14: // 3 + 1 vertical right (left top)
            case 15: // 3 + 1 vertical right (left bottom)
                x = piece[row][1] * hexWidth/2;

                if(row == 3)
                {
                    if(number == 12 || number == 13)
                        x += hexWidth/2;
                    else if(number == 14 || number == 15)
                        x -= hexWidth/2;
                }
                break;
            
            case 16: // diamond vertical
            case 17: // diamond left
            case 18: // diamond right
                x = piece[row][1] * hexWidth;

                if(number == 16)
                    x = piece[row][1] * hexWidth/2;
                if(row == 0 || row == 1)
                    x += hexWidth/2;
                break;
        
            case 19: // flower top
            case 20: // flower bottom
                x = piece[row][1] * hexWidth;

                if(row == 2 || row == 3)
                    x -= hexWidth/2;
                break;
            case 21: // flower left up
            case 22: // flower right down
                x = piece[row][1] * hexWidth/2;

                if(number == 21)
                    x = piece[row][1] * hexWidth;

                if(row == 2)
                    x -= hexWidth/2;
                else if(row == 3)
                    x -= hexWidth;
                break;
            case 23: // flower right up
            case 24: // flower left down
                x = piece[row][1] * hexWidth/2;

                if(row == 0 || row == 3)
                    x += hexWidth/2;
                break;
        }

        hexagon.style.left = x + "px";
        hexagon.style.top = y + "px";
        hexagon.addEventListener('mousedown', (function(x, y){return function() {hexagonX = x; hexagonY = y};})(x, y)); 
        movingArea.appendChild(hexagon);
    }
    document.getElementById(fixedArea).appendChild(movingArea);
}

function showPieces() // Add random pieces to the game
{
    generatePiece(Math.floor(Math.random()* PIECES.length), "piecesArea1");
    generatePiece(Math.floor(Math.random()* PIECES.length), "piecesArea2");
    generatePiece(Math.floor(Math.random()* PIECES.length), "piecesArea3");
}

function movePiece() // Drag a piece into the grid
{
    const dropZone = document.getElementById('hexagonArea'); // The hexagonal grid
    
    dropZone.addEventListener('dragenter', function(event){event.preventDefault();});
    dropZone.addEventListener('dragover', function(event){event.preventDefault()});

    dropZone.addEventListener('drop', function(event) 
    {
        event.preventDefault();

        const data = JSON.parse(event.dataTransfer.getData('text'));
        const pieceAreaId = data.movingAreaId; // The area to move the piece
        const fixedAreaId = data.fixedAreaId;  // The pieces area that doesn't move
        const piece = document.getElementById(pieceAreaId); // The piece (the moving area)

        // In case the piece cannot be placed, store its previous coordinates
        var prevX = piece.offsetLeft;
        var prevY = piece.offsetTop;

        // Get mouse position relative to the drop zone
        const mouseX = event.clientX - (dropZone.getBoundingClientRect().left 
                                     - dropZone.parentElement.getBoundingClientRect().left);
        const mouseY = event.clientY - (dropZone.getBoundingClientRect().top
                                     - dropZone.parentElement.getBoundingClientRect().top);

        // Get the closest hexagon position to the mouse position in the drop zone
        const closestHexagon = getClosestHexagonPosition(mouseX, mouseY);

        // Adjust the piece to the closest hexagon, taking into account the position of the piece (not the area)
        piece.style.position = "absolute";
        piece.style.left = closestHexagon.x - Math.floor(hexagonX) + "px";
        piece.style.top = closestHexagon.y - Math.floor(hexagonY) + "px";

        // Check if the position where the piece wants to be placed is valid
        for(var i = 0; i<piece.children.length; i++)
        {
            var coord = getHexagonCoordinates(piece.children[i], piece);
            var row = coord.row; var col = coord.col;
              
            // The piece must be within the limits of the grid and placed in a free place in the grid
            if(row < 0 || row >= rows || col < 0 || col >= cols || !grid[row][col] || grid[row][col].occupied)
            { // If not, the piece goes back to its area and is not placed in the grid
                piece.style.position = "relative";
                piece.style.left = prevX + "px";
                piece.style.top = prevY + "px";
                document.getElementById(fixedAreaId).appendChild(piece);

                attempts++; // Failed attempt to place a piece
                if(attempts >= 3) // 3 or more consecutive failed attemtps to place a piece -> the game ends
                {
                    alert("End of the game!\nYour score is: " + score);
                    location.reload(); // Reinitiate the game
                }
                return;
            }
        }

        // If the place is correct, the properties are updated and the piece is placed in the grid
        for(var i = 0; i<piece.children.length; i++)
        {
            var hex = piece.children[i];
            var coord = getHexagonCoordinates(hex, piece);
            grid[coord.row][coord.col].occupied = true;
            grid[coord.row][coord.col].id = hex.id;
            attempts = 0; // When a piece is successfully placed, the failed attempts counter starts again
        }

        
        dropZone.appendChild(piece);
        piece.draggable = false; // Once a piece is placed it cannot be moved anymore
        generatePiece(Math.floor(Math.random() * PIECES.length), fixedAreaId); // When a piece is placed another one must appear
        setScore(40); // Placing a piece in the grid -> +40 points
        checkCompletedLines(); // Check if any row or diagonal is completed 
    });
}

function getClosestHexagonPosition(mouseX, mouseY) // Using grid hexagons' coordinates
{
    let closestPosition = null;
    let closestDistance = Infinity;

    for (let row = 0; row < grid.length; row++) 
    {
        for (let col = 0; col < grid[row].length; col++) 
        {
            if(grid[row][col]) // Ensure the position is valid
            { 
                var pos = grid[row][col];
                var dx = mouseX - pos.x;
                var dy = mouseY - pos.y;

                if (dx >= 0 && dy >= 0) 
                {
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < closestDistance) 
                    {
                        closestDistance = distance;
                        closestPosition = { x: pos.x, y: pos.y };
                    }
                }
            }
        }
    }
    return closestPosition;
}

function getHexagonCoordinates(hex, piece) 
{
    var x = (hex.getBoundingClientRect().left - hex.parentElement.getBoundingClientRect().left) 
        + (piece.getBoundingClientRect().left - piece.parentElement.getBoundingClientRect().left);
    var y = (hex.getBoundingClientRect().top - hex.parentElement.getBoundingClientRect().top) 
        + (piece.getBoundingClientRect().top - piece.parentElement.getBoundingClientRect().top);

    var row = Math.round(y/(hexHeight*0.65));
    var offset = row <= 4 ? 4 - row : row - 4;
    var col = Math.round((x - (hexWidth / 2 * offset) - 10)/hexWidth);

    return {row, col};
}

/** CHECKING COMPLETED ROWS/DIAGONALS AND REMOVING THEM */
function isRowComplete(row)
{
    return grid[row].every(col => col && col.occupied);
}
function isDiagonalComplete(diagonal) {
    return diagonal.every(coord => grid[coord[0]][coord[1]].occupied);
}
function checkCompletedLines() 
{
    var completeRows = [];
    var completeLines = [];

    // Coordinates of both diagonals
    const coordMainDiagonals = 
    [
        [[4, 0], [5, 0], [6, 0], [7, 0], [8, 0]],
        [[3, 0], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]],
        [[2, 0], [3, 1], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]],
        [[1, 0], [2, 1], [3, 2], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]],
        [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4]],
        [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 5], [6, 5], [7, 5]],
        [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6], [6, 6]],
        [[0, 3], [1, 4], [2, 5], [3, 6], [4, 7], [5, 7]],
        [[0, 4], [1, 5], [2, 6], [3, 7], [4, 8]]
    ];

    const coordSecondDiagonals = 
    [
        [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
        [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 0]],
        [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 1], [6, 0]],
        [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 2], [6, 1], [7, 0]],
        [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 3], [6, 2], [7, 1], [8, 0]],
        [[1, 5], [2, 5], [3, 5], [4, 5], [5, 4], [6, 3], [7, 2], [8, 1]],
        [[2, 6], [3, 6], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2]],
        [[3, 7], [4, 7], [5, 6], [6, 5], [7, 4], [8, 3]],
        [[4, 8], [5, 7], [6, 6], [7, 5], [8, 4]]
    ];

    // Check rows
    grid.forEach((row, index) => 
    {
        if (isRowComplete(index)) 
            completeRows.push(row.map((col, colIndex) => [index, colIndex]));
    });

    // Check main diagonals
    coordMainDiagonals.forEach((diagonal) => 
    {
        if (isDiagonalComplete(diagonal)) 
            completeLines.push(diagonal);
    });

    // Check second diagonals
    coordSecondDiagonals.forEach((diagonal) =>
    {
        if (isDiagonalComplete(diagonal)) 
            completeLines.push(diagonal);
    });

    // Remove completed rows or diagonals
    completeRows.forEach(row => removeHexagons(row));
    completeLines.forEach(line => removeHexagons(line));

    setScore(100*completeLines.length + 100*completeRows.length); // Remove a line -> +100 points
}
function removeHexagons(coords) 
{
    coords.forEach(coord => 
    {
        const [i, j] = coord;
        const hexagon = document.getElementById((grid[i][j]).id);
        if(hexagon && hexagon.parentElement)
        {
            hexagon.parentElement.removeChild(hexagon);
            grid[i][j].occupied = false;
        }
    });
}
