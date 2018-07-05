'use strict';
const Generator = require('yeoman-generator');
const xml2js = require('xml2js');
const _ = require('loadsh');
const merge = require('deepmerge');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel'); // This method adds support for a `--babel` flag
    this.argument('statemachineFiles', {
      type: Array,
      required: true
    });
    this.log(this.options.statemachineFiles);
    const oldStatemachines = this.config.get('statemachines');
    const newStatemachines = this.options.statemachineFiles.map(statemachineFile => {
      let obj;
      xml2js.parseString(
        this.fs.read(this.destinationPath(statemachineFile)),
        (err, result) => {
          if (err) {
            throw err;
          } else {
            obj = result;
          }
        }
      );
      return obj;
    });
    if (oldStatemachines) {
      this.statemachines = merge(oldStatemachines, newStatemachines, {
        arrayMerge: (destinationArray, sourceArray) => sourceArray
      });
    } else {
      this.statemachines = newStatemachines;
    }
    this.config.set('statemachines', this.statemachines);
    this.log(JSON.stringify(this.statemachines));
  }

  async prompting() {}

  writing() {
    this.statemachines.forEach(statemachine => {
      this.fs.copyTpl(
        this.templatePath('foo.statemachine.ts.ejs'),
        this.destinationPath(
          `${this.config.get('serverProjectName')}/src/entities/${_.kebabCase(
            statemachine.scxml.$.entityname
          )}/${_.kebabCase(statemachine.scxml.$.enumname)}.statemachine.ts`
        ),
        {
          statemachine,
          _
        }
      );
    });
    this.fs.copyTpl(
      this.templatePath('statemachine-import.ts.ejs'),
      this.destinationPath(
        `${this.config.get('serverProjectName')}/src/entities/statemachine-import.ts`
      ),
      {
        _,
        statemachines: this.statemachines
      }
    );
  }

  install() {}
};
