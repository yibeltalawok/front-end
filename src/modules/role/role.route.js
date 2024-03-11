import RoleList from './list/RoleList'
import RoleCreate from './new/RoleCreate'
import RoleUpdate from './update/RoleUpdate'

export default [
    {
        path: 'role/list',
        name: 'role-list',
        component: RoleList
    },
    {
        path: 'role/new',
        name: 'role-create',
        component: RoleCreate
    },
    {
        path: 'role/:roleId/update',
        name: 'role-update',
        component: RoleUpdate
    }
]