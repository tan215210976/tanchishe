// import pig from '../public/pig.jpg'
import '../css/mian.scss';
import { runInThisContext } from 'vm';
// const img=document.createElement('img')
// img.src=pig

// document.querySelector('#app').appendChild(img)
// ---------------------------------------------------------------------
function translate(x, y) {
	return `translate(${x}px,${y}px)`;
}
// 地图
class ContontMap {
	constructor(query, option = {}) {
		// 查找地图dom
		this.Dom = document.querySelector(query);
		if (!this.Dom) return false;
		//获取配置，根据配置生成地图大小 以及背景色
		this.option = option;
		this.Dom.style.width = (option.width ? option.width : 0) + 'px';
		this.Dom.style.height = (option.height ? option.height : 0) + 'px';
		this.Dom.style.background = option.background;
		//初始化食物和贪吃蛇
		this.appChildItem(20, 20);
		new Snake(this, SnakeOption);
	}
	//添加随机豆子
	appChildItem(width = 20, height = 20) {
		let dom = document.createElement('div');
		dom.id = 'food';
		dom.style.width = (width ? width : 0) + 'px';
		dom.style.height = (height ? height : 0) + 'px';
		// 地图内有多少个格子
		this.xWidth = Math.ceil(this.option.width / width) || 40;
		this.xHeight = Math.ceil(this.option.height / height) || 40;
		// 随机颜色
		dom.style.background = this.randomColor();
		let x = Math.floor(Math.random() * this.xWidth);
		let y = Math.floor(Math.random() * this.xHeight);
		dom.style.position = 'absolute';
		dom.style.transform = `translate(${x * width}px,${y * height}px)`;
		dom.x = x;
		dom.y = y;
		this.food = dom;
		this.Dom.appendChild(dom);
		return this;
	}
	// 删除随机豆子
	removeChildItem(id) {
		let dom = document.getElementById(id || 'food');
		this.Dom.removeChild(dom);
		this.appChildItem(20, 20);
		return this;
	}
	// 随机颜色
	randomColor() {
		let r = Math.floor(Math.random() * 255);
		let g = Math.floor(Math.random() * 255);
		let b = Math.floor(Math.random() * 255);
		return `rgb(${r},${g},${b})`;
	}
}
// 蛇类
class Snake {
	constructor(mapContext, options) {
		this.SnakeDom = document.createElement('ul');
		this.SnakeDom.style.position = 'absolute';
		// this.SnakeDom.style.background=options.background
		this.options = options;
		this.mapContext = mapContext;
		// 初始化开始走向状态
		this.status = 'right';
		let x = Math.min(options.x || 0, mapContext.xWidth);
		let y = Math.min(options.y || 0, mapContext.xHeight);
		// 定制起始位置
		let startX = x * options.width;
		let startY = y * options.height;
		for (let i = options.num; i > 0; i--) {
			let item = document.createElement('li');
			item.style.position = 'absolute';
			item.cindex = i;
			// 宽高
			item.style.width = (options.width ? options.width : 0) + 'px';
			item.style.height = (options.height ? options.height : 0) + 'px';
			// 位置
			item.style.transform = translate(startX + i * options.width, startY);
			// 记录蛇的位置
			item.x = x + i;
			item.y = y;
			//蛇背景
			item.style.background = options.background;
			this.SnakeDom.appendChild(item);
		}
		mapContext.Dom.appendChild(this.SnakeDom);
		this.timer = null;
		window.addEventListener('keydown', e => {
			//   console.log(e.keyCode)
			switch (e.keyCode) {
				case 37: //左边
					this.status = 'left';
					//   this.xNum--
					break;
				case 40: //下边
					//   this.yNum++
					this.status = 'bottom';
					break;
				case 39: //右边
					//   this.xNum++
					this.status = 'right';
					break;
				case 38: //上面
					//   this.yNum--
					this.status = 'top';
					break;
			}
		});
		// this.run();
	}
	//执行动画
	animation() {
		let List = [...this.SnakeDom.children];
		let options = this.options;
		for (let i = List.length - 1; i > 0; i--) {
			List[i].x = List[i - 1].x;
			List[i].y = List[i - 1].y;
		}
		if (this.status === 'right') {
			List[0].x++;
		}
		if (this.status === 'left') {
			List[0].x--;
		}
		if (this.status === 'bottom') {
			List[0].y++;
		}
		if (this.status === 'top') {
			List[0].y--;
		}
		// 重新渲染
		List.forEach(item => {
			item.style.transform = translate(item.x * options.width, item.y * options.height);
		});

		//碰到食物
		if (List[0].x == this.mapContext.food.x && List[0].y == this.mapContext.food.y) {
			let Foodx=this.mapContext.food.x
			let Foody=this.mapContext.food.y
			this.mapContext.removeChildItem();
			let item = document.createElement('li');
			item.style.position = 'absolute';
			item.cindex = List.length;
			// 宽高
			item.style.width = (options.width ? options.width : 0) + 'px';
			item.style.height = (options.height ? options.height : 0) + 'px';
			// 位置
			let x = Foodx;
			let y = Foody;
			item.style.transform = translate(x * options.width, y * options.height);
			// 记录蛇的位置
			item.x = x;
			item.y = y;
			//蛇背景
			item.style.background = options.background;
			this.SnakeDom.insertBefore(item,this.SnakeDom.children[0]);
			List=[...this.SnakeDom.children]
		}
		
		// // 碰到边界问题
		// if (this.status === 'right'&&List[0].x==) {
			
		// }
		// if (this.status === 'left') {
		// }
		// if (this.status === 'bottom') {
		// }
		// if (this.status === 'top') {
		// }

	}
	// 执行动画
	run() {
		if (this.timer) {
			this.stop();
		}
		this.timer = setInterval(() => {
			this.animation();
		}, 500);
	}
	// 停止动画
	stop() {
		clearInterval(this.timer);
		this.timer = null;
	}
}
// 地图配置
let options = {
	width: 800,
	height: 800,
	background: '#ccc'
};
//蛇配置
let SnakeOption = {
	width: 20,
	height: 20,
	x: 2,
	y: 2,
	num: 4,
	background: '#000'
};
new ContontMap('#app', options);
// -------------------------------------------------

// window.addEventListener('message',(e)=>{
//     console.log(e)
// })

// setTimeout(()=>{
//     window.postMessage('测试一下','*')
// },2000)
