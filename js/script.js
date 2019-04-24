var isBlack = true; //是否轮到黑色棋子下
var BLACK = 1,
	WHITE = 2;
var chessBoard = []; // 存放所有的落子点，如果是黑棋则对应位置设为BLACK,有白棋则设置为WHITE
var isOver = false; //标志游戏是否结束

var wins = []; //记录所有的赢法
var playWins = []; //我方的赢法统计数组
var aiWins = []; //电脑的赢法统计数组

var chess = document.getElementById("chess"); //获取canvas元素
var context = chess.getContext("2d"); //返回一个对象，该对象提供了用于在画布上绘图的方法和属性
context.strokeStyle = "#000"; //画笔颜色
//context.moveTo(15,15); //定义起点
//context.lineTo(435,15); //创建从起点到最后指定点的线条
//context.stroke(); //绘制已定义的路径。

//画棋盘网格
for (var i = 0; i < 15; i++) {
	//划竖线
	context.moveTo(15 + 30 * i, 15);
	context.lineTo(15 + 30 * i, 450 - 15);
	context.stroke();

	//划横线
	context.moveTo(15, 15 + 30 * i);
	context.lineTo(450 - 15, 15 + 30 * i);
	context.stroke();
}

//画棋子
// context.beginPath(); //起始一条路径
// context.arc(200,200,100,0,2*Math.PI); //创建弧/曲线 
// context.closePath(); //关闭路径
// var gradient = context.createRadialGradient(200, 200, 50, 200, 200, 20);
//     gradient.addColorStop(0, "#0a0a0a");
//     gradient.addColorStop(1, "#636363");
//     context.fillStyle = gradient ;
// context.fill(); //填充当前绘图

//封装的画棋子的函数
//i和j代表棋子的坐标， isBlack代表下的是否是黑棋
var setupChess = function(i, j, isBlack) {
	context.beginPath(); //起始一条路径
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); //创建弧/曲线  
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 15, 15 + i * 30, 15 + j * 30, 0); //创建放射的渐变
	if (isBlack) {
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#636363");
	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill(); //填充当前绘图
}
//	setupChess(5,6,true); //测试
//	setupChess(9,10,false);

var showMessage = function(msg) {
	context.font = "bold 48px Arial ";
	var gradient = context.createLinearGradient(0, 0, 450, 0);
	gradient.addColorStop("0", "red");
	gradient.addColorStop("1.0", "blue");
	context.fillStyle = gradient;
	context.fillText(msg, 50, 220);
}

//鼠标落子
chess.onclick = function(e) {
	if (isOver) {
		return; //游戏结束
	}
	if (!isBlack) {
		return; //没轮到玩家下，无法点击
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		setupChess(i, j, isBlack);
		chessBoard[i][j] = isBlack ? BLACK : WHITE;
		isBlack = !isBlack;

		for (var k = 0; k < wins.length; k++) {
			if (wins[k][i] && wins[k][i][j]) {
				playWins[k]++; //我方对该赢法的统计+1
				aiWins[k] = -100; //此种赢法里有我方棋子，则电脑对应的该赢法作废
				if (playWins[k] == 5) {
					//达到5颗子，达成赢法
					isOver = true; //游戏结束
					showMessage("恭喜你赢了！！");
					break;
				}
			}
		}
		if (!isOver) {
			computerAI(); //轮到电脑下子
		}
	}
}

//有一个问题，已经下了黑子的点，重新点击还会被白子覆盖掉
//定义一个二维数组，存放所有的落子点
//初始化该数组
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

//记录所有的赢法
var count = 0;
(function() {
	var line = [];
	//横向赢法
	for (var j = 0; j < 15; j++) {
		for (var i = 0; i < 11; i++) {
			for (var k = 0; k < 5; k++) {
				if (!line[i + k]) line[i + k] = [];
				line[i + k][j] = true;
			}
			wins[count++] = line;
			line = [];
		}
	}
	//纵向赢法
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				if (!line[i]) line[i] = [];
				line[i][j + k] = true;
			}
			wins[count++] = line;
			line = [];
		}
	}
	//斜线赢法
	for (var i = 4; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				if (!line[i - k]) line[i - k] = [];
				line[i - k][j + k] = true;
			}
			wins[count++] = line;
			line = [];
		}
	}
	//反斜线赢法
	for (var i = 0; i < 11; i++) {
		for (var j = 4; j < 15; j++) {
			for (var k = 0; k < 5; k++) {
				if (!line[i + k]) line[i + k] = [];
				line[i + k][j + k] = true;
			}
			wins[count++] = line;
			line = [];
		}
	}

	console.log(count);
	for (var i = 0; i < count; i++) {
		playWins[i] = 0;
		aiWins[i] = 0;
	}
})();

//电脑下子函数
var computerAI = function() {
	var playerScore = [], //保存玩家的对每个点的分数
		aiScore = []; //保存AI的对每个点的分数
	var max = 0, //所有点的最高分数
		x, //最高分数的点的x坐标
		y; //最该分数的点的y坐标

	//初始化用于分数统计的2维数组
	for (var i = 0; i < 15; i++) {
		playerScore[i] = [];
		aiScore[i] = [];
		for (var j = 0; j < 15; j++) {
			playerScore[i][j] = 0;
			aiScore[i][j] = 0;
		}
	}

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				//如果这个位置没有落子
				for (var k = 0; k < wins.length; k++) {
					//遍历所有赢法，查找包含这个位置的所有赢法
					if (wins[k][i] && wins[k][i][j]) {
						//该赢法里根据落子数来打分，落子数越多，分数越高，表示越接近赢
						switch (playWins[k]) {
							case 1:
								playerScore[i][j] += 10;
								break;
							case 2:
								playerScore[i][j] += 100;
								break;
							case 3:
								playerScore[i][j] += 1000;
								break;
							case 4:
								playerScore[i][j] += 10000;
								break;
						}

						//这里ai的分数要比玩家累加得多，是为了在相同落子数的情况下提高ai的分数，
						//使得ai更加倾向于进攻
						switch (aiWins[k]) {
							case 1:
								aiScore[i][j] += 12;
								break;
							case 2:
								aiScore[i][j] += 120;
								break;
							case 3:
								aiScore[i][j] += 1200;
								break;
							case 4:
								aiScore[i][j] += 12000;
								break;
						}
					}
				}

				//统计最高分数
				var m = Math.max(max, Math.max(playerScore[i][j], aiScore[i][j]));
				if (aiScore[i][j] == m) {
					//ai达到最高分数，ai在这个位置落子的赢的几率大，AI优先下到这个位置。（进攻）
					max = aiScore[i][j];
					x = i;
					y = j;
				} else if (playerScore[i][j] == m) {
					//否则玩家达到最高分数，玩家在这个位置落子的赢的几率大，AI优先下到这个位置。（防守）
					max = playerScore[i][j];
					x = i;
					y = j;
				}
			}
		}
	}

	//AI落子
	setupChess(x, y, isBlack);
	//棋盘数组里放入白子
	chessBoard[x][y] = WHITE;

	for (var k = 0; k < wins.length; k++) {
		if (wins[k][x] && wins[k][x][y]) {
			aiWins[k]++; //电脑的赢法统计数组+1
			playWins[k] = -100; //玩家的该赢法作废
			if (aiWins[k] == 5) {
				showMessage("呜呜呜，电脑赢啦!");
				//window.alert("computer win!")
				isOver = true;
				break;
			}
		}
	}

	if (!isOver) { //轮到玩家落子
		isBlack = !isBlack;
	}
}
