import { createRole, createAdminUser } from './utils';

export async function init(username: string, password: string, email: string) {
  const adminUser = await createAdminUser(username, password, email);
  const adminRole = await createRole('admin', adminUser);
  console.info('超级管理员:', adminUser.getUsername());
}