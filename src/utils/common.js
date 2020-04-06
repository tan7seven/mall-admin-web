/**
 *map转换为json
 */
export function _mapToJson(strMap) {
  let obj= Object.create(null);
  for (let[k,v] of strMap) {
    obj[k] = v;
  }
  return JSON.stringify(obj);
}
