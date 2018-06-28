const AV = require('leanengine');
/** 保存前 */
async function <%=entities[0].name%>_beforeSave(request) {
  
}
/** 保存后 */
async function <%=entities[0].name%>_afterSave(request) {
}
/** 更新前 */
async function <%=entities[0].name%>_beforeUpdate(request) {
}
/** 更新后 */
async function <%=entities[0].name%>_afterUpdate(request) {
  
}
/** 删除前 */
async function <%=entities[0].name%>_beforeDelete(request) {
  
}
/** 删除后 */
async function <%=entities[0].name%>_afterDelete(request) {
}
<% entities[1]&&entities[1].body.forEach(prop => { %>
/**<%=prop.javadoc%>*/
async function <%=prop.name%>({params, currentUser, sessionToken, meta}) {
  const objectId = params.objectId;
  if (!objectId) throw new Error('objectId must not null');
  const entity = AV.Object.createWithoutData('<%=entities[0].name%>', objectId);
  await entity.fetch();
  let currentState = entity.get('<%=(entities[0].body.find(item => item.type === entities[1].name.split('STATEMACHINE_')[1])).name%>');
  if (currentState !== <%=state.values.indexOf(prop.type.split('__')[0])%>) throw new Error('currentState must be <%=state.values.indexOf(prop.type.split('__')[0])%>,but get ${currentState}');
  entity.set('<%=(entities[0].body.find(item => item.type === entities[1].name.split('STATEMACHINE_')[1])).name%>', <%=state.values.indexOf(prop.type.split('__')[1])%>);
  return entity.save(null, {sessionToken});
}
<%})%>
module.exports = {
  <%=entities[0].name%>_beforeSave,
  <%=entities[0].name%>_afterSave,
  <%=entities[0].name%>_beforeUpdate,
  <%=entities[0].name%>_afterUpdate,
  <%=entities[0].name%>_beforeDelete,
  <%=entities[0].name%>_afterDelete,
<% entities[1]&&entities[1].body.forEach(prop => { %>
  <%=prop.name%>,
<%})%>
}