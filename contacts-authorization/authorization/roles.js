const ALL_USER_ROLES = ['admin', 'viewer']

const CAPABILITY_ROLES = {
  viewContacts: ['admin', 'viewer'],
  viewContact: ['admin', 'viewer'],
  createContact: ['admin'],
  deleteContact: ['admin']
}

const userHasAccess = (user, action) => {
  const role = user.role
  const allActions = Object.keys(CAPABILITY_ROLES)
  const isValidRole = ALL_USER_ROLES.includes(role);
  if(!isValidRole){
    throw new Error(`User with username: ${user.username} does not have a role!`);
  } else if (!allActions.includes(action)){
    throw new Error(`Tried to get permisions for an invalid action. Action: ${action}`);
  } else {
    const capabilities = CAPABILITY_ROLES[action]
    return capabilities.includes(user.role)
  }
}

module.exports = userHasAccess

// console.log(userHasAccess({role: 'admin'}, 'viewContacts'))
// console.log(userHasAccess({role: 'viewer'}, 'deleteContact'))
// //console.log(userHasAccess({role: 'viewer'}, 'invalidAction'))
// console.log(userHasAccess({role: 'god', username: 'A awesome dude'}, 'deleteContact'))
