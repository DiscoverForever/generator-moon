
function getStr(configs) {
  let data = '';
  configs.forEach((config, index) => {
    // add group wrapper
    if (config.withGroup === undefined || config.withGroup) data += `<group title="${config.groupTitle ? config.groupTitle : ''}" label-width="${config.labelWith ? config.labelWith : '5.5em'}" label-margin-right="${config.labelmarginRight ? config.labelmarginRight : '2em'}" label-align="${config.labelAlign ? config.labelAlign : 'justify'}">`;

    if (config.tagName === 'XInput')
      data += `<x-input title="${config.label}" type="${config.type}" is-type="${config.type}" v-model="${config.modelName}" ${config.placeholder ? `placeholder="${config.placeholder}"`: ''} ${config.min ? `:min="${config.min}"` : ''} ${config.max ? `:max="${config.max}"` : ''} ${config.required ? ':required="true"' : ''}></x-input>`;
    if (config.tagName === 'XButton')
      data += `<x-button type="${config.type}" action-type="${config.actionType}">${config.text}</x-button>`;
    if (config.tagName === 'XAddress')
      data += `<x-address title="${config.title}" v-model="${config.modelName}" :list="Private_ChinaAddressV4Data"></x-address>`;
    if (config.tagName === 'Datetime')
      data += `<datetime v-model="${config.modelName}"  title="${config.title}"></datetime>`;
    if (config.tagName === 'Tab')
      data += `<tab><tab-item :selected="index === 0" @on-item-click="Private_crrrentTabItem = index" :key="index" v-for="(item, index) in ${JSON.stringify(config.tabItems).replace(/"/g, "'")}">{{item}}</tab-item></tab>`;
    if (config.tagName === 'Actionsheet')
      data += `<cell title="${config.cellTitle ? config.cellTitle : '选择'}" @click.native="Private_isShowActionsheet${index} = !Private_isShowActionsheet${index}">{{${config.valueName}}}</cell>
    <actionsheet v-model="Private_isShowActionsheet${index}" :menus="${JSON.stringify(config.menus).replace(/"/g, "'")}" :show-cancel="true" @on-click-menu="(key, item) => ${config.valueName} = item"></actionsheet>`;
    if (config.tagName === 'XHeader') data += `<x-header>${config.title}</x-header>`;
    if (config.tagName === 'Calendar') data += `<calendar v-model="${config.modelName}" title="${config.title ? config.title : ''}" disable-past placeholder="${config.placeholder}" @on-show="log('show')" @on-hide="log('hide')"></calendar>`;
    if (config.tagName === 'XNumber') data += `<x-number :value="${config.valueName}" :min="${config.min ? config.min : 0}" :max="${config.max ? config.max : 1000}" button-style="${config.btnStyle ? config.btnStyle : 'square'}" title="${config.title}" fillable></x-number>`;
    // add group wrapper
    if (config.withGroup === undefined || config.withGroup) data += '</group>';
  });
  return data;
}

/**
 * 获取依赖组件
 * @param configs 
 * @param justComponent 只取依赖组件 
 */
function getDependencies(configs, justComponent = false) {
  let set = new Set();
  configs.forEach(config => {
    set.add(config.tagName);
    // need group wrapper
    if (config.tagName === 'XInput' || config.tagName === 'XAddress') set.add('Group');
    // need other dependence
    if (config.tagName === 'XAddress' && !justComponent) set.add('ChinaAddressV4Data');
    // need other component
    if (config.tagName === 'Actionsheet') set.add('Cell');
    if (config.tagName === 'Tab') set.add('TabItem');
  });
  // 去重
  let arr = Array.from(set);
  let data = '';
  arr.forEach((item, index) => {
    data += `${item}${index === arr.length - 1 ? '' : ','}`;
  });
  return data;
}

function getDataOptions(configs) {
  let data = '';
  configs.forEach((config, index) => {
    if (config.tagName === 'XInput') data += `${config.modelName}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},`;
    if (config.tagName === 'Datetime') data += `${config.modelName}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},`;
    if (config.tagName === 'XAddress') data += `${config.modelName}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},Private_ChinaAddressV4Data:ChinaAddressV4Data,`;
    if (config.tagName === 'Calendar') data += `${config.modelName}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},`;
    if (config.tagName === 'XNumber') data += `${config.valueName}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},`;
    if (config.tagName === 'Actionsheet') data += `${config.valueName}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},Private_isShowActionsheet${index}: false,`;
    if (config.tagName === 'Tab') data += `Private_crrrentTabItem : 0,`;
  });
  return data;
}

function getMethods(configs) {

}
/**
 * 生成表单
 * 
 * @param formConfig 
 */
function generateForm(formConfig) {
  return `
  <template>
  <div>
    ${getStr(formConfig, false)}
  </div>
  </template>
  <script>
  import { ${getDependencies(formConfig)} } from 'vux';
  export default {
    components: {
      ${getDependencies(formConfig, true)}
    },
    data() {
      return {
        ${getDataOptions(formConfig)}
      }
    },
    methods: {}
  };
  </script>
  <style scoped>
  </style>
  `;
}

module.exports.generateForm = generateForm;