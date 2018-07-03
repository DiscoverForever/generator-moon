import * as AV from 'leanengine';

/**
 * 创建管理员用户
 * @param {*} username 
 * @param {*} password 
 */
export async function createAdminUser(username: string, password: string, email: string): Promise<AV.User> {
  let adminUser = await getUser(username);
  if (adminUser) return adminUser;

  let user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  return user.signUp();
}

/**
 * 获取用户
 * @param {*} username 
 */
export function getUser(username): Promise<AV.User> {
  if (!username) throw new AV.Cloud.Error('username must not null');

  try {
    let userQuery = new AV.Query(AV.User as any);
    userQuery.equalTo('username', username);
    return userQuery.first();
  } catch (error) {
    throw new AV.Cloud.Error(`${username}query fail:${error.message}`);
  }
}

/**
 * 获取角色
 * @param {*} roleName 
 */
export async function getRole(roleName): Promise<AV.Role> {
  if (!roleName) throw new AV.Cloud.Error('roleName must not null');
  
  try {
    let roleQuery = new AV.Query(AV.Role as any);
    roleQuery.equalTo('name', roleName);
    return roleQuery.first() as any;
  } catch (error) {
    throw new AV.Cloud.Error(`${roleName}query fail:${error.message}`);
  }
}

/**
 * 创建角色
 * @param {*} roleName 
 * @param {*} creator 
 * @param {*} roleAcl 
 */
export async function createRole(roleName: string, creator: AV.User, roleAcl?: AV.ACL) {
  let role = await getRole(roleName);
  if (role) return role;

  roleAcl ? roleAcl : roleAcl = new AV.ACL();
  roleAcl.setPublicReadAccess(false);
  roleAcl.setPublicWriteAccess(false);
  roleAcl.setReadAccess(creator, true);
  roleAcl.setWriteAccess(creator, true);

  role = new AV.Role(roleName, roleAcl);
  return role.save();
}

/**
 * 为每张表创建角色
 * @param {*} entities 
 * @param {*} adminUser 
 */
export async function createEntityRoles(entities, adminUser) {
  let promiseList = entities.map(async entityName => {
      return await createRole(entityName, adminUser);
  });
  return Promise.all(promiseList)
}

/**
 * 授予用户角色
 * @export
 * @param {AV.User} user
 * @param {AV.Role} role
 * @returns
 */
export async function bindRoleForUser(user: AV.User, role: AV.Role) {
  let roleQuery = new AV.Query(AV.Role as any);
  roleQuery.equalTo('name', 'Administrator');
  // 检查当前用户是否已经拥有了该角色
  roleQuery.equalTo('users', user);
  roleQuery.equalTo('name', role.get('name'));
  const roles = await roleQuery.find();
  if (roles.length > 0) {
    return roles[0];
  } else {
    role.getUsers().add(user);
    return role.save();
  }
}

/**
 * 剥夺用户角色
 * @export
 * @param {AV.User} user
 * @param {string} roleName
 */
export async function unbindRoleForUser(user: AV.User, roleName: string) {
  const roleQuery = new AV.Query(AV.Role as any);
  roleQuery.equalTo('name', roleName);
  roleQuery.equalTo('user', user);
  const role = await roleQuery.first() as AV.Role;

  // 如果角色存在
  if (role) {
    // 剥夺角色
    const relation= role.getUsers();
    relation.remove(user);
    return role.save();
  }
  return;
}

/**
 * 添加子角色
 * @param role 
 * @param subRole 
 */
export function addSubRole(role: AV.Role, subRole: AV.Role) {
  role.getRoles().add(subRole);
  return role.save();
}

/**
 * 删除子角色
 * @param role 
 * @param subRole 
 */
export function removeSubRole(role: AV.Role, subRole: AV.Role) {
  role.getRoles().remove(subRole);
  return role.save();
}