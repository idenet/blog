// 最长公共前缀

const strs = ['flower', 'flow', 'flight']

const longestCommonPrefix = function (strs) {
  if (!strs.length) return ''
  if (strs.length == 1) return strs[0]

  let strTemp = strs[0],
    strTempLen = strTemp.length,
    arrLen = strs.length,
    result = '',
    flag = 1,
    charTemp
  for (let i = 0; i < strTempLen; i++) {
    charTemp = strTemp[i]
    for (let j = 1; j < arrLen; j++) {
      if (charTemp !== strs[j][i]) return result
      flag++
      if (flag === arrLen) {
        flag = 1
        result += charTemp
      }
    }
  }
  return result
}

/**
 * 反转链表
 */
// 递归
const reverseList = function (head) {
  // 边界
  if (!head || !head.next) return head
  let last = reverseList(head.next)
  head.next.next = head
  head.next = null
  return last
}

// 迭代

const reverseList = function (head) {
  // 初始节点 前驱节点为null
  let pre = null
  // 初始节点为头结点
  let cur = head
  while (cur !== null) {
    // 记录下一个节点
    let next = cur.next
    // 反转指针
    cur.next = pre
    // 前进一步
    pre = cur
    cur = next
  }
  return pre
}