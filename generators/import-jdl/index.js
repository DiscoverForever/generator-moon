'use strict';
const Generator = require('yeoman-generator');
const jhiCore = require('jhipster-core');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel'); // This method adds support for a `--babel` flag
    this.argument('jdlFiles', {
      type: Array,
      required: true
    });
    this.options.jdlFiles = this.options.jdlFiles.map(jdlFile =>
      this.destinationPath(jdlFile)
    );
    this.jdlObjects = jhiCore.parseFromFiles(this.options.jdlFiles);
    this.log(JSON.stringify(this.jdlObjects));
  }

  async prompting() {}

  writing() {
    this.jdlObjects.entities.forEach(entity => {
      this.log(entity.name);
      this.fs.copyTpl(
        this.templatePath('entity.ts.ejs'),
        this.destinationPath(`entities/${entity.name}/${entity.name}.ts`),
        {
          entity
        }
      );
      this.fs.copyTpl(
        this.templatePath('hook.js.ejs'),
        this.destinationPath(`entities/${entity.name}/${entity.name}.hook.js`),
        {
          entity
        }
      );
      this.fs.copyTpl(
        this.templatePath('entity.model.ts.ejs'),
        this.destinationPath(`entities/${entity.name}/${entity.name}.model.ts`),
        {
          entity,
          relationships: this.jdlObjects.relationships,
          enums: this.jdlObjects.enums,
          dto: this.jdlObjects.dto
        }
      );
    });
  }

  install() {}
};
