// 游戏实例化


class Game {

    constructor(w, h, z, ms = 60, bg = '#000', linebg = 'pink') {
        this.c = document.createElement('canvas'); //
        this.z = z; //比例
        this.w = w; //画布宽
        this.h = h; //高
        this.cw = this.w * this.z;
        this.ch = this.h * this.z;
        this.c.width = this.cw;
        this.c.height = this.ch;
        this.c.style.background = bg;
        document.body.appendChild(this.c);
        this.ctx = this.c.getContext('2d');
        this.ms = 1000 / ms; //秒刷新
        this.run = true;
        this.linebg = linebg; //格子颜色
        this.call = []; //

    }

    showLine() { //画格子

        for (var i = 0; i < this.w; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.linebg;
            this.ctx.moveTo(i * this.z, 0);
            this.ctx.lineTo(i * this.z, this.ch);
            this.ctx.stroke();
        }

        for (var i = 0; i < this.h; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.linebg;
            this.ctx.moveTo(0, i * this.z);
            this.ctx.lineTo(this.cw, i * this.z);
            this.ctx.stroke();
        }
    }

    clean(x, y, w, h) {
        var option = this.convertOption(x, y, w, h);
        this.ctx.clearRect(option.x, option.y, option.w, option.h); //画矩形
        return this;
    }

    changeStatus(data) { //状态切换
        this.run = data;
        if (data === true) {
            this.runGame();
        }
        return this;
    }

    drawing(callbake) { //对当前对象画图？
        callbake(this);
        return this;
    }

    draw(option) {

        switch (option.type) {
            case 'react':
                this.freact(option.x, option.y, option.w, option.h, option.color);
                break;
            case 'arc':
                this.farc(option.x, option.y, option.w, option.color); //半径
                break;
        }
    }

    convertOption(x, y, w, h = 0) { //转换坐标
        return {
            x: this.z * x,
            y: this.z * y,
            w: this.z * w,
            h: this.z * h,
        }
    }

    freact(x, y, w, h, bg = '#000') {
        this.ctx.fillStyle = bg;
        var option = this.convertOption(x, y, w, h);
        this.ctx.fillRect(option.x, option.y, option.w, option.h); //画矩形
        return this;
    }

    farc(x, y, w, bg = '#000') {
        this.ctx.beginPath();
        this.ctx.fillStyle = bg;
        var option = this.convertOption(x, y, w / 2);
        this.ctx.shadowColor = "gray";
        this.ctx.arc(option.x, option.y, option.w, 0, 2 * Math.PI); //画圆
        this.ctx.fill();
        // return this;
    }

    sarc(x, y, r, bg = '#000') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = bg;
        var option = this.convertOption(x, y, w);
        this.ctx.arc(option.x, option.y, option.w / 2, 0, 2 * Math.PI); //画空心圆
        this.ctx.stroke();
        this.ctx.closePath();
        return this;
    }

    clear() {
        this.ctx = this.c.getContext('2d');
        this.c.height = this.ch;
        this.showLine();
        this.ctx.restore(); //保存
        return this;
    }

    init(callback) {
        this.call = callback;
        this.runGame();
    }

    sping() {
        return new Spring();
    }

    runGame(timer = 0, old = 0) {
        if (this.run) {

            if (old > this.ms) {
                this.call(); //当经过时间超过设定的帧间隔，执行init传入的回调函数
                old = 0; //重新计时

            }
            requestAnimationFrame(time => {
                this.runGame(time, time - timer + old); //传入时间戳参数，，old是以执行时间
            });
        }
    }
}

class Sprite {

    constructor(game, x, y, w, h, vx = 0, vy = 0) {
        this.drawEle = game;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.z = this.drawEle.z;
        this.Springlist = [];
    }

    group(sprite) {
        this.Springlist.push(sprite); //
    }

    addSpriteListOption(option) {
        this.Springlist.forEach(val => {
            val.prototype = option;
        });
    }

    draw(callback) {
        this.Springlist.forEach(val => {
            callback(val);
        });
    }

    random(min, max) {
        var base = max - min;
        return parseInt(Math.random() * base + min, 10);
    }

    rcolor() {
        var c1 = '#';
        var cArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < 6; i++) {
            var cIndex = Math.round(Math.random() * 14);
            c1 += cArray[cIndex];
        }
        return c1;
    };

    check() {

    }
}