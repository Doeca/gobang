var chessData;

function getPosition(signMap) {
    chessData = signMap;
    var a = new Array(2);
    var score = 0;
    for (var x = 0; x < 15; x++) {
        for (var y = 0; y < 15; y++) {
            if (chessData[x][y] == 0) {
                if (judge(x, y) > score) {
                    score = judge(x, y);
                    a[0] = y;
                    a[1] = x;
                }
            }
        }
    }
    return a;
}


function judge(x, y) {
    var a = parseInt(leftRight(x, y, 1)) + parseInt(topBottom(x, y, 1)) + parseInt(rightBottom(x, y, 1)) + parseInt(rightTop(x, y, 1)) + 100; //判断白棋走该位置的得分
    var b = parseInt(leftRight(x, y, 2)) + parseInt(topBottom(x, y, 2)) + parseInt(rightBottom(x, y, 2)) + parseInt(rightTop(x, y, 2)); //判断黑棋走该位置的得分
    var result = a + b;
    // console.log("我计算出了" + x + "," + y + "这个位置的得分为" + result);
    return result; //返回黑白棋下该位置的总和
}

function leftRight(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var livex = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
        arr[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            arr[i][j] = chessData[i][j];
        }
    }
    arr[x][y] = num;
    for (var i = x; i >= 0; i--) {
        if (arr[i][y] == num) {
            count++;
        } else if (arr[i][y] == 0) {
            livex += 1; //空位标记
            i = -1;
        } else {
            death += 1; //颜色不同是标记一边被堵住
            i = -1;
        }
    }
    for (var i = x; i <= 14; i++) {
        if (arr[i][y] == num) {
            count++;
        } else if (arr[i][y] == 0) {
            livex += 1; //空位标记
            i = 100;
        } else {
            death += 1;
            i = 100;
        }
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的左右得分为" + model(count, death));
    return model(count, death);
}

function topBottom(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var livex = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
        arr[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            arr[i][j] = chessData[i][j];
        }
    }
    arr[x][y] = num;
    for (var i = y; i >= 0; i--) {
        if (arr[x][i] == num) {
            count++;
        } else if (arr[x][i] == 0) {
            livex += 1; //空位标记
            i = -1;
        } else {
            death += 1;
            i = -1;
        }
    }
    for (var i = y; i <= 14; i++) {
        if (arr[x][i] == num) {
            count++;
        } else if (arr[x][i] == 0) {
            livex += 1; //空位标记
            i = 100;
        } else {
            death += 1;
            i = 100;
        }
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的上下斜得分为" + model(count, death));
    return model(count, death);
}

function rightBottom(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var livex = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
        arr[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            arr[i][j] = chessData[i][j];
        }
    }
    arr[x][y] = num;
    for (var i = x, j = y; i >= 0 && j >= 0;) {
        if (arr[i][j] == num) {
            count++;
        } else if (arr[i][j] == 0) {
            livex += 1; //空位标记
            i = -1;
        } else {
            death += 1;
            i = -1;
        }
        i--;
        j--;
    }
    for (var i = x, j = y; i <= 14 && j <= 14;) {
        if (arr[i][j] == num) {
            count++;
        } else if (arr[i][j] == 0) {
            livex += 1; //空位标记
            i = 100;
        } else {
            death += 1;
            i = 100;
        }
        i++;
        j++;
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的右下斜得分为" + model(count, death));
    return model(count, death);
}

function rightTop(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var livex = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
        arr[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            arr[i][j] = chessData[i][j];
        }
    }
    arr[x][y] = num;
    for (var i = x, j = y; i >= 0 && j <= 14;) {
        if (arr[i][j] == num) {
            count++;
        } else if (arr[i][j] == 0) {
            livex += 1; //空位标记
            i = -1;
        } else {
            death += 1;
            i = -1;
        }
        i--;
        j++;
    }
    for (var i = x, j = y; i <= 14 && j >= 0;) {
        if (arr[i][j] == num) {
            count++;
        } else if (arr[i][j] == 0) {
            livex += 1; //空位标记
            i = 100;
        } else {
            death += 1;
            i = 100;
        }
        i++;
        j--;
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的右上斜得分为" + model(count, death));
    return model(count, death);
}
/**罗列相等效果的棋型(此处只考虑常见的情况，双成五，双活四等少概率事件不考虑)
 * 必胜棋：成五=活四==双活三=冲四+活三=双冲四
 * 
 * 
 * 
 */
function model(count, death) {
    // console.log("count" + count + "death" + death);
    var LEVEL_ONE = 0; //单子
    var LEVEL_TWO = 1; //眠2，眠1
    var LEVEL_THREE = 1500; //眠3，活2
    var LEVEL_FOER = 4000; //冲4，活3
    var LEVEL_FIVE = 10000; //活4
    var LEVEL_SIX = 100000; //成5
    if (count == 1 && death == 1) {
        return LEVEL_TWO; //眠1
    } else if (count == 2) {
        if (death == 0) {
            return LEVEL_THREE; //活2
        } else if (death == 1) {
            return LEVEL_TWO; //眠2
        } else {
            return LEVEL_ONE; //死棋
        }
    } else if (count == 3) {
        if (death == 0) {
            return LEVEL_FOER; //活3
        } else if (death == 1) {
            return LEVEL_THREE; //眠3
        } else {
            return LEVEL_ONE; //死棋
        }
    } else if (count == 4) {
        if (death == 0) {
            return LEVEL_FIVE; //活4
        } else if (death == 1) {
            return LEVEL_FOER; //冲4
        } else {
            return LEVEL_ONE; //死棋
        }
    } else if (count == 5) {
        return LEVEL_SIX; //成5
    }
    return LEVEL_ONE;
}
export default getPosition;