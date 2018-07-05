'use strict';
const Generator = require('yeoman-generator');
const jhiCore = require('jhipster-core');
const _ = require('loadsh');
const merge = require('deepmerge');
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
    const newJdlObjects = jhiCore.parseFromFiles(this.options.jdlFiles);
    const oldJdlObjects = this.config.get('jdlObjects');
    if (oldJdlObjects) {
      this.jdlObjects = merge(oldJdlObjects, newJdlObjects, {
        arrayMerge: (destinationArray, sourceArray) => sourceArray
      });
    } else {
      this.jdlObjects = newJdlObjects;
    }
    this.config.set('jdlObjects', this.jdlObjects);
    this.log(JSON.stringify(this.jdlObjects));
  }

  async prompting() {}

  writing() {
    this.fs.copyTpl(
      this.templatePath('cloud-import.ts.ejs'),
      this.destinationPath(
        `${this.config.get('serverProjectName')}/src/entities/cloud-import.ts`
      ),
      {
        entities: this.jdlObjects.entities,
        _
      }
    );
    this.jdlObjects.entities.forEach(entity => {
      this.fs.copyTpl(
        this.templatePath('hook.ts.ejs'),
        this.destinationPath(
          `${this.config.get('serverProjectName')}/src/entities/${_.kebabCase(
            entity.name
          )}/${_.kebabCase(entity.name)}.hook.ts`
        ),
        {
          entity,
          _
        }
      );
      this.fs.copyTpl(
        this.templatePath('entity.model.ts.ejs'),
        this.destinationPath(
          `${this.config.get('serverProjectName')}/src/entities/${_.kebabCase(
            entity.name
          )}/${_.kebabCase(entity.name)}.model.ts`
        ),
        {
          entity,
          relationships: this.jdlObjects.relationships,
          enums: this.jdlObjects.enums,
          dto: this.jdlObjects.dto,
          _
        }
      );
      this.fs.copyTpl(
        this.templatePath('role.ts.ejs'),
        this.destinationPath(`${this.config.get('serverProjectName')}/src/util/role.ts`),
        {
          entities: this.jdlObjects.entities,
          _
        }
      );
    });
  }

  install() {}
};
