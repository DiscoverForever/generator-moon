function getProps(props) {
  let str = '';
  props.forEach(prop => {
    str += `${prop.name}:${prop.type};\n`;
  });
  return str;
}
module.exports.generateEntity = entity => {
  return `
  // generated at ${new Date().toLocaleString()}
  class ${entity.name} {
    ${getProps(entity.body)}
  }
  `
}