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
      },
      {
        type: 'input',
        name: 'adminUsername',
        required: true,
        message: '请输入超级管理员的用户名?(用于创建管理员用户)',
        default: 'admin'
      },
      {
        type: 'password',
        name: 'adminPassword',
        required: true,
        message: '请输入超级管理员的密码?(用于创建管理员用户)',
        default: 'admin'
      },
      {
        type: 'input',
        name: 'adminEmail',
        required: true,
        message: '请输入超级管理员的邮箱?(用于接收bug通知)'
      }
    ];

    this.props = await this.prompt(prompts);
    for (let key in this.props) {
      if (Object.prototype.hasOwnProperty.call(this.props, key)) {
        this.config.set(key, this.props[key]);
      }
    }
    this.config.save();
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('express-ts'),
      this.destinationPath(`${this.props.appname}-express-ts`),
      {
        config: this.config.getAll()
      },
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
