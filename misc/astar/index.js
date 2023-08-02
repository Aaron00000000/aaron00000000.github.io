// 定义 100 x 100 的底盘数据
// 使用 localStorage 获取，如果没有就新建一个
let map = localStorage['maze-map'] ? JSON.parse(localStorage['maze-map']) : Array(10000).fill(0);

// 获取 container DOM元素对象
let container = document.getElementById('container');

// 遍历所有格子
for (let y = 0; y < 100; y++) {
  for (let x = 0; x < 100; x++) {
    // 创建地图方格
    let cell = document.createElement('div');
    cell.classList.add('cell');
    // 遇到格子的状态是 1 的，就赋予背景颜色'aqua'
    if (map[100 * y + x] == 1) cell.style.backgroundColor = 'aqua';
    // 添加鼠标移动监听事件
    cell.addEventListener('mousemove', () => {
      // 只有在鼠标点击状态下执行
      if (mousedown) {
        if (clear) {
          // 1. 右键点击时，设置格子的状态0：正常。这里相当于清除障碍物
          cell.style.backgroundColor = '';
          map[100 * y + x] = 0;
        } else {
          // 2. 左键点击时，设置格子的状态1：障碍物
          cell.style.backgroundColor = 'aqua';
          map[100 * y + x] = 1;
        }
      }
    });
	  // 将cell加入到 container 之中
    container.appendChild(cell);
  }
}

let mousedown = false;
let clear = false;

// 鼠标按键点击时，把鼠标点击状态变为 true
document.addEventListener('mousedown', e => {
  mousedown = true;
  clear = e.which === 3;
});
// 松开鼠标按键后，把状态更变成 false
document.addEventListener('mouseup', () => (mousedown = false));
// 因为我们需要使用右键，所以要把右键默认打开菜单禁用
document.addEventListener('contextmenu', e => e.preventDefault());

/**
 * 等待函数
 * @param {Integer} t 时间 (毫秒)
 * @return Promise
 */
function sleep(t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
