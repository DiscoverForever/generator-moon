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
        message: '项目名称?',
        default: this.appname,
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '项目名格式错误')
      },
      {
        type: 'input',
        name: 'adminUsername',
        message: '请输入超级管理员的用户名?(用于创建管理员用户)',
        default: 'admin',
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '用户名不可用')
      },
      {
        type: 'password',
        name: 'adminPassword',
        default: 'admin',
        message: '请输入超级管理员的密码?(用于创建管理员用户)'
      },
      {
        type: 'input',
        name: 'adminEmail',
        message: '请输入超级管理员的邮箱?(用于接收bug通知)',
        validate: input =>
          /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
            input
          )
            ? true
            : '邮件格式不正确'
      },
      {
        type: 'input',
        name: 'leancloudAppId',
        message: '请输入Leancloud AppId?(用于初始化SDK)',
        default: this.config.get('leancloudAppId'),
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '格式错误')
      },
      {
        type: 'input',
        name: 'leancloudAppKey',
        message: '请输入Leancloud AppKey?((用于初始化SDK))',
        default: this.config.get('leancloudAppKey'),
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '格式错误')
      },
      {
        type: 'input',
        name: 'leancloudMasterKey',
        message: '请输入Leancloud MasterKey?((用于初始化SDK))',
        default: this.config.get('leancloudMasterKey'),
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '格式错误')
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
      null,
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
