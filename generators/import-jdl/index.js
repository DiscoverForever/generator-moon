'use strict';
const Generator = require('yeoman-generator');
const jhiCore = require('jhipster-core');
const _ = require('loadsh');
const merge = require('deepmerge');
const querystring = require('querystring');

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
    this.jdlObjects.entities.forEach(entity => {
      const params = entity.javadoc && entity.javadoc.split('?')[1];
      entity.params = params ? querystring.parse(params) : {};
      entity.javadoc = entity.javadoc && entity.javadoc.replace(/\?.*$/g, '');
    });
    this.jdlObjects.relationships.forEach(relationship => {
      if (relationship.cardinality === 'one-to-one') {
        this.jdlObjects.entities.forEach(entity => {
          if (entity.name === relationship.from.name) {
            entity.body.push({
              name: relationship.from.injectedfield
                ? relationship.from.injectedfield
                : _.camelCase(relationship.to.name),
              type: `Pointer_${relationship.to.name}`,
              validations: [],
              javadoc: relationship.to.name
            });
          } else if (entity.name === relationship.to.name) {
            entity.body.push({
              name: relationship.to.injectedfield
                ? relationship.to.injectedfield
                : _.camelCase(relationship.from.name),
              type: `Pointer_${relationship.from.name}`,
              validations: [],
              javadoc: relationship.from.name
            });
          }
        });
      } else if (relationship.cardinality === 'one-to-many') {
        this.jdlObjects.entities.forEach(entity => {
          if (entity.name === relationship.to.name) {
            entity.body.push({
              name: relationship.to.injectedfield
                ? relationship.to.injectedfield
                : _.camelCase(relationship.from.name),
              type: `Pointer_${relationship.from.name}`,
              validations: [],
              javadoc: relationship.from.name
            });
          }
        });
      } else if (relationship.cardinality === 'many-to-many') {
        this.jdlObjects.entities.push({
          name: relationship.from.name + relationship.to.name,
          tableName: relationship.from.name + relationship.to.name,
          body: [
            {
              name: relationship.from.name,
              type: `Pointer_${relationship.from.name}`,
              validations: [],
              javadoc: relationship.from.name
            },
            {
              name: relationship.to.name,
              type: `Pointer_${relationship.to.name}`,
              validations: [],
              javadoc: relationship.to.name
            }
          ],
          javadoc: relationship.from.name + relationship.to.name,
          params: {}
        });
      }
    });
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
    this.fs.copyTpl(
      this.templatePath('vue-element-admin/src/lang/'),
      this.destinationPath(`${this.config.get('clientProjectName')}/src/lang/`),
      {
        entities: this.jdlObjects.entities,
        _
      }
    );
    this.fs.copyTpl(
      this.templatePath('vue-element-admin/src/router/entities.js'),
      this.destinationPath(
        `${this.config.get('clientProjectName')}/src/router/entities.js`
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
        this.templatePath('vue-element-admin/src/views/entity/index.vue'),
        this.destinationPath(
          `${this.config.get('clientProjectName')}/src/views/${_.kebabCase(
            entity.name
          )}/index.vue`
        ),
        {
          entity,
          _
        }
      );
      this.fs.copyTpl(
        this.templatePath('vue-element-admin/src/views/entity/dialog-search.vue'),
        this.destinationPath(
          `${this.config.get('clientProjectName')}/src/views/${_.kebabCase(
            entity.name
          )}/dialog-search.vue`
        ),
        {
          entity,
          _
        }
      );
      this.fs.copyTpl(
        this.templatePath('vue-element-admin/src/views/entity/entity-add.vue'),
        this.destinationPath(
          `${this.config.get('clientProjectName')}/src/views/${_.kebabCase(
            entity.name
          )}/${_.kebabCase(entity.name)}-add.vue`
        ),
        {
          entity,
          enums: this.jdlObjects.enums,
          _
        }
      );
      this.fs.copyTpl(
        this.templatePath('vue-element-admin/src/views/entity/entity-edit.vue'),
        this.destinationPath(
          `${this.config.get('clientProjectName')}/src/views/${_.kebabCase(
            entity.name
          )}/${_.kebabCase(entity.name)}-edit.vue`
        ),
        {
          entity,
          enums: this.jdlObjects.enums,
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
