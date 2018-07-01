'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  async prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'appname',
        message: 'Your project name?',
        default: this.appname
      }
    ];

    this.props = await this.prompt(prompts);
    this.config.set('appname', this.props.appname);
    this.config.save();
  }

  writing() {
    this.fs.copy(
      this.templatePath('express-ts'),
      this.destinationPath(`${this.props.appname}-express-ts`),
      {
        globOptions: {
          dot: true
        }
      }
    );
  }

  install() {
    this.yarnInstall(null, null, {
      cwd: this.destinationPath(`${this.props.appname}-express-ts`)
    });
  }
};
