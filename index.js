var cp = require('child_process');

var args = process.argv;

args = args.slice(2);

var cmd = args.shift();

console.log(cmd, args);

function start() {
  console.log('Starting', cmd, 'with args', args, 'in', process.cwd());
  var child = cp.spawn(cmd, args, {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  child.on('exit', function (code) {
    console.log(cmd, 'exited with exit code:', code);
    if (code === 0) {
      start();
    } else {
      process.exit(code);
    }
  });
}

start();