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
