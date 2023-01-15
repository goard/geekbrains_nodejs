const colors = require('colors');
const args = process.argv.slice(2);

function isNumber(arr) {
  let check = false;
  arr.every((el) => {
    if (!Number.isInteger(+el)) {
      check = true;
      return false;
    }
    return true;
  });
  return check;
}

if (args.length === 0) {
  console.log(colors.red('Введите диапозон простых чисел'));
  return;
}

const checkNumber = isNumber(args);

if (checkNumber) {
  console.log(colors.red('Введите числа для диапозона'));
  return;
}
let m = +args[0];
let n = +args[1];

nextPrime: for (let i = m; i <= n; i++) {
  // Для всех i...

  for (let j = m; j < i; j++) {
    // проверить, делится ли число..
    if (i % j == 0) {
      continue nextPrime;
    } // не подходит, берём следующее
  }

  console.log(i);
}

