export function pregMatch (regex, str) {
  return (new RegExp(regex).test(str))
}
