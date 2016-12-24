var inp = ['1236', '1234', '1231', '1235'];
sessionStorage.setItem("inputs", JSON.stringify(inp));
var result = JSON.parse(sessionStorage.getItem("inputs"));

console.log(result);
var count = 0;
var mark = _.find(inp, function (i) {
  count += 1;
  if (i == '1231') {
    return count;
  }
});
console.log(count)
inp.splice(count - 1, 1);
console.log(inp, "====");
