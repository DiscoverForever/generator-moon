const fs = require('fs-extra');
const core = require('jhipster-core');
const parse = core.parse;

/**
 * 读取JDL文件
 * @param targetPath JDL文件路径
 * @returns { JSON }
 */
function readJDLFile(targetPath) {
  const jdl = fs.readFileSync(targetPath).toString();
  const jdlFilter = jdl
    .replace(/->/g, '__') // JDL不支持特殊符号
    .replace(
      /(^enum\b.*?\{)([\s\S]*?)(\})/gm,
      jdl.match(/(^enum\b.*?\{)([\s\S]*?)(\})/gm)[0]
        ? jdl.match(/(^enum\b.*?\{)([\s\S]*?)(\})/gm)[0].replace(/\/\*{2}.*\*\//gm, '')
        : ''
    ) // 删除enum的注释（JDL格式化不支持注释）
    .replace(/^STATEMACHINE\s*(\w*)\s*\{/gm, 'entity STATEMACHINE_$1 {'); // 状态机改为entity （因JDL不支持状态机 伪扩展）
  return parse(jdlFilter);
}

module.exports = {
  readJDLFile
};
