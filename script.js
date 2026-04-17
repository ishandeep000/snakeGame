const board = document.querySelector(".board");

const modal = document.querySelector(".modal");
const startButton = document.querySelector(".start-btn");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart-btn");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = `00:00`;
highScoreElement.innerText = highScore;

const blockHeight = 30;
const blockWidth = 30;
const blocks = [];
let rows,cols;
function createGrid(){
    board.innerHTML = "";
    blocks.length = 0;
    cols = Math.floor(board.clientWidth/blockWidth);
    rows = Math.floor(board.clientHeight/blockHeight);

    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
        }
    }
}

let intervalID = null;
let timerIntervalID = null;

let food = { x: 0, y: 0 }; 
let snake = [
    {
      x:6,
      y:7
    },
    {
      x:6,
      y:8
    },
    { 
      x:6,
      y:9
    },
];

let direction = 'right';
function renderSnake(){
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");
    if(direction==="left"){
        head = {x: snake[0].x, y: snake[0].y-1};
     }
    else if(direction==="right"){
        head = {x: snake[0].x, y: snake[0].y+1};
    }
    else if(direction==="down"){
        head = {x: snake[0].x+1, y: snake[0].y};
    }
    else if(direction==="up"){
        head = {x: snake[0].x-1, y: snake[0].y};
    }

    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(intervalID);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }
    snake.forEach(point=>{
        blocks[`${point.x}-${point.y}`].classList.remove("fill");
    });
    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 10;
        scoreElement.textContent = score;
        if(score>highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    }
    else{
        snake.unshift(head);
        snake.pop();
    }
    snake.forEach(point => {
        blocks[`${point.x}-${point.y}`].classList.add("fill");
    });
};

startButton.addEventListener("click", function(){
    modal.style.display = "none";
    createGrid();
    food = {
        x: Math.floor(Math.random()*rows),
        y: Math.floor(Math.random()*cols)
    };
    intervalID = setInterval(()=>{
        renderSnake();
    },200);
    timerIntervalID = setInterval(()=>{
        let [min,sec] = time.split(":").map(Number);
        if(sec===59){
            min+=1;
            sec = 0;
        }
        else{
            sec+=1;
        }
        time = `${min}:${sec}`;
        timeElement.textContent = time;
    },1000)
})

restartButton.addEventListener("click", restartGame);
function restartGame(){
    clearInterval(intervalID);
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(point => {
        blocks[`${point.x}-${point.y}`].classList.remove("fill");
    });
    modal.style.display = "none";
    createGrid();
    snake = [
        {
          x:6,
          y:7
        },
        {
          x:6,
          y:8
        },
        { 
          x:6,
          y:9
        },
    ];
    food = {
        x: Math.floor(Math.random()*rows),
        y: Math.floor(Math.random()*cols)
    }
    direction = "down";
    intervalID = setInterval(()=>{
        renderSnake();
    },200);
    score = 0;
    time = `00:00`;

    scoreElement.textContent = score;
    timeElement.textContent = time;
    highScoreElement.textContent = highScore;

}

addEventListener("keydown", function(event){
    if(event.key==="ArrowUp" && direction !== "down"){
        direction = "up";
    }
    else if(event.key==="ArrowDown" && direction !== "up"){
        direction = "down";
    }
    else if(event.key==="ArrowLeft" && direction !== "right"){
        direction = "left";
    }
    else if(event.key==="ArrowRight" && direction !== "left"){
        direction = "right";
    }
});
