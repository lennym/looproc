var cp = require('child_process');
var path = require('path');;
var concat = require('concat-stream');
var argh = require('argh').argv;

var args = process.argv;
var cwd = process.cwd();
var interval = 5000;
var cmd;

if (argh.cmd) {
  cmd = argh.cmd;
  args = argh.args ? [argh.args] : [];
  cwd = argh.cwd || cwd;
  var bits = cmd.split(' ');
  if (bits.length > 1) {
    cmd = bits[0];
    args.unshift.apply(args, bits.slice(1));
  }
  interval = argh.interval || interval;
} else {
  args = args.slice(2);
  cmd = args.shift();
}

cwd = path.resolve(process.cwd(), cwd);

function clear() {
  process.stdout.write('\u001B[2J\u001B[0;0f');
}

function start() {
  var output;
  var processStream = concat(function (src) {
    output = src;
  });

  console.log('Starting', cmd, 'with args', args, 'in', cwd);

  var child = cp.spawn(cmd, args, {
    cwd: cwd
  });

  child.stdout.pipe(processStream);

  child.stderr.pipe(processStream);

  child.on('exit', function (code) {
    //console.log(cmd, 'exited with exit code:', code);
    if (code === 0) {
      console.log(cmd, 'successfully completed. Restarting...');
      setTimeout(function () {
        clear();
        start();
      }, interval);
    } else {
      process.stderr.write(output);
      process.exit(code);
    }
  });
}

clear();
start();