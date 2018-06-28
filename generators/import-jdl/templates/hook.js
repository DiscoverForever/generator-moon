const AV = require('leanengine');
const EX_<%=entities[0].name%> = require('./<%=entities[0].name%>.ex');
const G_<%=entities[0].name%> = require('./<%=entities[0].name%>.g');
/** 保存前 */
AV.Cloud.beforeSave('<%=entities[0].name%>', async function(request) {
  await EX_<%=entities[0].name%>.<%=entities[0].name%>_beforeSave(request);
  return G_<%=entities[0].name%>.<%=entities[0].name%>_beforeSave(request);
});
/** 保存后 */
AV.Cloud.afterSave('<%=entities[0].name%>', async function(request) {
  await EX_<%=entities[0].name%>.<%=entities[0].name%>_afterSave(request);
  return G_<%=entities[0].name%>.<%=entities[0].name%>_afterSave(request);
});
/** 更新前 */
AV.Cloud.beforeUpdate('<%=entities[0].name%>', async function(request) {
  await EX_<%=entities[0].name%>.<%=entities[0].name%>_beforeUpdate(request);
  return G_<%=entities[0].name%>.<%=entities[0].name%>_beforeUpdate(request);
});
/** 更新后 */
AV.Cloud.afterUpdate('<%=entities[0].name%>', async function(request) {
  await EX_<%=entities[0].name%>.<%=entities[0].name%>_afterUpdate(request);
  return G_<%=entities[0].name%>.<%=entities[0].name%>_afterUpdate(request);
});
/** 删除前 */
AV.Cloud.beforeDelete('<%=entities[0].name%>', async function(request) {
  await EX_<%=entities[0].name%>.<%=entities[0].name%>_beforeDelete(request);
  return G_<%=entities[0].name%>.<%=entities[0].name%>_beforeDelete(request);
});
/** 删除后 */
AV.Cloud.afterDelete('<%=entities[0].name%>', async function(request) {
  await EX_<%=entities[0].name%>.<%=entities[0].name%>_afterDelete(request);
  return G_<%=entities[0].name%>.<%=entities[0].name%>_afterDelete(request);
});
<% entities[1]&&entities[1].body.forEach(prop => { %>
/**<%=prop.javadoc%>*/
AV.Cloud.define('<%=prop.name%>', async ({params, currentUser, sessionToken, meta}) => {
  const objectId = params.objectId;
  if (!objectId) throw new Error('objectId must not null');
  const entity = AV.Object.createWithoutData('<%=entities[0].name%>', objectId);
  await entity.fetch();
  let currentState = entity.get('<%=(entities[0].body.find(item => item.type === entities[1].name.split('STATEMACHINE_')[1])).name%>');
  if (currentState !== <%=state.values.indexOf(prop.type.split('__')[0])%>) throw new Error('currentState must be <%=state.values.indexOf(prop.type.split('__')[0])%>,but get ${currentState}');
  entity.set('<%=(entities[0].body.find(item => item.type === entities[1].name.split('STATEMACHINE_')[1])).name %>', <%=state.values.indexOf(prop.type.split('__')[1])%>);
  return entity.save(null, {sessionToken});
});
<%})%>
  