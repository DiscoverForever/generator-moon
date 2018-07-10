import AV from 'leanengine';

export function getAclByObject(currentUser: AV.User, aclObject: Object) {
  const acl = new AV.ACL();

  for (const key in aclObject) {
    if (key === '*') {
      acl.setPublicReadAccess(aclObject[key]['read']);
      acl.setPublicWriteAccess(aclObject[key]['write']);
    } else if (key === 'currentUser') {
      acl.setReadAccess(currentUser, aclObject[key]['read']);
      acl.setWriteAccess(currentUser, aclObject[key]['write']);
    } else {
      const roleName = key.split('role:')[1];
      acl.setRoleReadAccess(roleName, true);
      acl.setRoleWriteAccess(roleName, true);
    }
  }

  return acl;
}