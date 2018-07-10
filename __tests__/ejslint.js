/* global describe, beforeEach, it */

const assert = require('assert');
const ejslint = require('ejs-lint');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

describe('EJS Lint', () => {
  const opts = {
    delimiter: '%',
  };
  it('EJS templates are valid', () => {
    const files = glob.sync(path.join(__dirname, '..', 'generators/**/*.ejs'));
    files.forEach((file) => {
      if (fs.statSync(file).isFile()) {
        const content = fs.readFileSync(file, 'utf8');
        const err = ejslint(content, opts);
        if (err) {
          assert(true === false, `${err.message} at (${err.line}:${err.column}) in ${file}`);
        }
      }
    });

  });
});
