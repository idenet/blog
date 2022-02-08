
// 二叉树
function treeNode (val) {
  this.val = val
  this.left = this.right = null
}



// 二叉树
const root = {
  val: "A",
  left: {
    val: "B",
    left: {
      val: "D"
    },
    right: {
      val: "E"
    }
  },
  right: {
    val: "C",
    right: {
      val: "F"
    }
  }
}

// 先序遍历

function preorder (root) {
  // 递归边界

  if (!root) return

  console.log('输出当前遍历的节点值', root.val)
  // 递归左子树
  preorder(root.left)
  // 递归右子树
  preorder(root.right)
}

preorder(root)