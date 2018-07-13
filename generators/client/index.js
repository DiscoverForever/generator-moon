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
        name: 'clientProjectName',
        message: '客户端项目名称?',
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '格式错误')
      },
      {
        type: 'list',
        name: 'webTemplateName',
        message: '请选择您要使用的项目模版',
        choices: ['vue-element-admin'],
        default: 'vue-element-admin'
      },
      {
        type: 'list',
        name: 'dbType',
        message: '请选择您要使用的数据库',
        choices: ['leancloud'],
        default: 'leancloud'
      },
      {
        type: 'input',
        name: 'leancloudAppId',
        message: '请输入Leancloud AppId?(用于初始化SDK)',
        default: this.config.get('leancloudAppId'),
        when: input => input.dbType === 'leancloud',
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '格式错误')
      },
      {
        type: 'input',
        name: 'leancloudAppKey',
        message: '请输入Leancloud AppKey?((用于初始化SDK))',
        default: this.config.get('leancloudAppKey'),
        when: input => input.dbType === 'leancloud',
        validate: input => (/^[a-zA-Z0-9_-]{1,}$/.test(input) ? true : '格式错误')
      },
      {
        type: 'input',
        name: 'leancloudMasterKey',
        message: '请输入Leancloud MasterKey?((用于初始化SDK))',
        default: this.config.get('leancloudMasterKey'),
        when: input => input.dbType === 'leancloud',
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
      this.templatePath(this.props.webTemplateName),
      this.destinationPath(this.props.clientProjectName),
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
      cwd: this.destinationPath(this.props.clientProjectName)
    });
    this.log(`执行以下命令运行项目\ncd ${this.props.clientProjectName} && npm run dev`);
  }
};
