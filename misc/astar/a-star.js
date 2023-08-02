var MAX = Number.MAX_SAFE_INTEGER

/**
 * 节点类
 */
class Node {
  constructor(x, y) {
    this.x = x          // 坐标x
    this.y = y          // 坐标y
    this.G = MAX        // 起点到当前节点的代价
    this.H = MAX        // 当前节点到终点的代价估值
    this.F = MAX        // 起点到当前节点的总代价 F = G + H
    this.parent = null  // 父节点，用来回溯路径节点
  }
}

/**
 * A*寻路
 * @param {Array} map   地图数据: 一维数组[]
 * @param {Array} start 起点[x1, y1]
 * @param {Array} end   终点[x2,y2]
 */
async function aStarSearch(map, start, end) {
  const openList = []   // 未探索的节点列表 Node[]
  const closeList = []  // 探索过的节点坐标列表 {x: _x, y: _y}[]

  const STEP = 10       // 横、纵向移动一步的代价
  const CORNER = 14     // 对角线移动一步的代价：2的平方根=1.414
  // 初始化
  const [x, y] = start
  const nodeStart = new Node(x, y)
  nodeStart.G = 0
  openList.push(nodeStart) // 将起点加入openList

  // 探索给定节点的相邻节点
  async function exploreAjacentNodes(node) {
    const {x, y} = node
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((!(i === x && j === y)) && reachable(i, j)) {
          await renderCell(j * 100 + i, 'DARKSLATEBLUE')

          const g = node.G + (((node.x - i) * (node.y - j) === 0) ? STEP : CORNER)
          let idx = inList(i, j, openList)
          if (idx === -1) { // 如果不在openList里面，计算G、H、F值，并将当前节点设为父节点后加入到openList
            const newNode = new Node(i, j)
            newNode.G = g
            newNode.H = Math.abs(end[0] - i) * STEP + Math.abs(end[1] - j) * STEP // 只计算横、纵方向上的距离，忽略障碍
            newNode.F = newNode.G + newNode.H
            newNode.parent = node
            openList.push(newNode)
          } else {  // 如果在openList里面
            const old = openList[idx]
            if (g < old.G) {  // 如果当前g值比原来的更小，更新节点的G和F(H估值不会变)；否则什么也不做
              old.parent = node
              old.G = g
              old.F = g + old.H
            }
          }
        }
      }
    }
  }

  // 给地图格子设置背景色
  async function renderCell(idx, color) {
    // 加入1毫秒的停顿，让我们可以看到UI的变化
    await sleep(1)
    container.children[idx].style.backgroundColor = color
  }

  // 坐标 [x, y] 是否可达
  function reachable(x, y) {
    // 如果坐标超出范围，返回false。这里是100 * 100
    if (x < 0 || x >= 100 || y < 0 || y >= 100) return false
    // 如果遇到地图中的障碍物，返回false
    if (map[y * 100 + x] === 1) return false
    // 如果节点在closeList中，返回false
    if (inList(x, y, closeList) !== -1) return false

    return true
  }

  console.time('a-star')
  // 循环从openList取出F值最小的节点，直到openList为空
  while (openList.length) {
    let current = openList.shift() // 弹出排序后的头节点
    closeList.push({x: current.x, y: current.y})   // 将当前节点加入到己探索列表

    if (current.x === end[0] && current.y === end[1]) { // 找到目标节点，退出
      let path = []
      while (current.x !== start[0] || current.y !== start[1]) { // 回溯节点并加入到path
        await renderCell(current.y * 100 + current.x, 'fuchsia')

        path.unshift(current)
        current = current.parent
      }

      console.timeEnd('a-star')
      return path
    }

    await exploreAjacentNodes(current)

    openList.sort((a, b) => a.F - b.F) // 根据F值排序
  }
  console.timeEnd('a-star')
  return null
}

/**
 * 查找坐标 [x, y] 在坐标数组中的下标。没查找到则返回-1
 * @param {Number} x 横坐标
 * @param {Number} y 纵坐标
 * @param {Object} _list 包含坐标的对象数组
 * @returns 下标值
 */
function inList(x, y, _list) {
  for (let i in _list) {
    if (x === _list[i].x && y === _list[i].y) {
      return i
    }
  }
  return -1
}