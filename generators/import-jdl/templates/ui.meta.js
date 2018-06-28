
function getInput(prop, type) {
  let item = {
    tagName: 'XInput',
    modelName: prop.name,
    type: type,
    label: prop.name,
    defaultValue: type === 'number' ? 1 : '',
    max: 6,
    isType: () => {},
    placeholder: prop.javadoc,
    groupTitle: prop.javadoc,
  };
  prop.validations.forEach(validation => {
    if (validation.key === 'required') validation.value = true;
    item[validation.key] = validation.value;
  });
  return item;
}

function getActionsheet(prop, enu, index) {
  return {
    tagName: 'Actionsheet',
    defaultValue: enu.values[0],
    valueName: `currntMenu${index}`,
    cellTitle: prop.name,
    showCancle: true,
    cancelText: '关闭',
    menus: enu.values,
    groupTitle: prop.javadoc,
    
  }
}

function getDatetime(prop, index) {
  return {
    tagName: 'Datetime',
    title: prop.name,
    modelName: prop.name,
    defaultValue: new Date().toLocaleDateString(),
    groupTitle: prop.javadoc,
    
  };
}

function getAddress(prop, index) {
  return {
    tagName: 'XAddress',
    title: prop.name,
    modelName: prop.name,
    defaultValue: [],
    placeholder: "请选择地址",
    groupTitle: prop.javadoc,
  };
}

module.exports.generateUiMeta = function (entity, enums) {
  let obj = { form: [] };
  let enumNames = enums.map(enu => enu.name);
  entity.body.forEach((prop, index) => {
    let item;
    if (prop.type === 'Service') return;
    if (prop.type === 'String') item = getInput(prop, 'text');
    if (prop.type === 'Date' || prop.type === 'Date') item = getDatetime(prop, index);
    if (prop.type === 'Address') item = getAddress(prop, index);
    if (prop.type === 'Integer' || prop.type === 'Long' || prop.type === 'BigDecimal' || prop.type === 'Float' || prop.type === 'Double' || prop.type === 'Float' || prop.type === 'Float') item = getInput(prop, 'number');
    if (enumNames.includes(prop.type)) {
      item = getActionsheet(prop, enums.find(enu => enu.name === prop.type), index);
    }
    if (item) obj.form.push(item);
  });


  return JSON.stringify(obj);
}

