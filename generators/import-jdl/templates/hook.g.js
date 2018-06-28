const AV = require('leanengine');
/** 保存前 */
async function <%=entities[0].name%>_beforeSave(request) {
  let entity = request.object;
  entity.set('createdBy', request.user);
  entity.set('state', 0);
}
/** 保存后 */
async function <%=entities[0].name%>_afterSave(request) {
}
/** 更新前 */
async function <%=entities[0].name%>_beforeUpdate(request) {
  if (!request.user) throw new Error('您还未登录');
  let entity = request.object;
  entity.set('updatedby', request.user);
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

function setACL(acl, currentUser) {
  let entity = request.object;
  let acl = new AV.ACL();
  const ACL = <%-JSON.stringify(ACL).replace(/^"(.*)"$/g, '$1')%>;
  for (var key in ACL) {
    if (key === '*') {
      acl.setPublicReadAccess(ACL[key][read]);
      acl.setPublicWriteAccess(ACL[key][write]);
    }
    if (key.startsWith('role')) {
      const roleName = key.split(':')[1];
      const roleQuery = new AV.Query(AV.Role);
      roleQuery.equalTo('name', roleName);
      const role = roleQuery.first();
      acl.setRoleReadAccess(role, ACL[key][read])
      acl.setRoleWriteAccess(role, ACL[key][write]);
    }
    acl.setReadAccess(currentUser, true);
    acl.setWriteAccess(currentUser, true);
  }
  entity.setACL(acl);
}

function createRole(roleName, roleAcl) {
  roleAcl ? roleAcl : roleAcl = new AV.ACL();
  roleAcl.setPublicReadAccess(false);
  roleAcl.setPublicWriteAccess(false);
  // roleAcl.setWriteAccess(admin, true);

  const role = new AV.Role(roleName, acl);
  return role.save();
}

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