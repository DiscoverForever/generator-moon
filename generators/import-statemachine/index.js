'use strict';
const Generator = require('yeoman-generator');
const xml2js = require('xml2js');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel'); // This method adds support for a `--babel` flag
    this.argument('statemachineFiles', {
      type: Array,
      required: true
    });
    this.log(this.options.statemachineFiles);
    this.statemachineObjects = this.options.statemachineFiles.map(statemachineFile => {
      let obj;
      xml2js.parseString(
        this.fs.read(this.destinationPath(statemachineFile)),
        (err, result) => {
          if (err) {
            throw err;
          } else {
            obj = Object.assign(result, {
              entityName: path.basename(statemachineFile, '.xml')
            });
          }
        }
      );
      return obj;
    });
    this.log(JSON.stringify(this.statemachineObjects));
  }

  async prompting() {}

  writing() {
    this.statemachineObjects.forEach(statemachine =>
      this.fs.copyTpl(
        this.templatePath('cloud.js.ejs'),
        this.destinationPath(`${statemachine.entityName}-statemachine.js`),
        {
          statemachine
        }
      )
    );
  }

  install() {}
};
