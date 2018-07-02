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
    this.fs.copyTpl(
      this.templatePath('cloud-import.ts.ejs'),
      this.destinationPath(
        `${this.config.get('appname')}-express-ts/entities/cloud-import.ts`
      ),
      {
        entities: this.jdlObjects.entities
      }
    );
    this.jdlObjects.entities.forEach(entity => {
      this.fs.copyTpl(
        this.templatePath('hook.ts.ejs'),
        this.destinationPath(
          `${this.config.get('appname')}-express-ts/entities/${entity.name}/${
            entity.name
          }.hook.ts`
        ),
        {
          entity
        }
      );
      this.fs.copyTpl(
        this.templatePath('entity.model.ts.ejs'),
        this.destinationPath(
          `${this.config.get('appname')}-express-ts/entities/${entity.name}/${
            entity.name
          }.model.ts`
        ),
        {
          entity,
          relationships: this.jdlObjects.relationships,
          enums: this.jdlObjects.enums,
          dto: this.jdlObjects.dto
        }
      );
      this.fs.copyTpl(
        this.templatePath('role.ts.ejs'),
        this.destinationPath(`${this.config.get('appname')}-express-ts/role.ts`),
        {
          entities: this.jdlObjects.entities
        }
      );
    });
  }

  install() {}
};
