import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../services/role.service";

export const useRole = () => {
    const queryClient = useQueryClient();

    //Get All Roles
    const getAllRolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: roleService.getAllRoles,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    //Get All Permissions
    const getAllPermissionsQuery = useQuery({
        queryKey: ['permissions'],
        queryFn: roleService.getAllPermissions,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    //Create Role
    const createRoleMutation = useMutation({
        mutationFn: roleService.createRole,
        onSuccess: () => {
            queryClient.invalidateQueries(['roles']);
        },
        onError: (error) => {
            console.error('Create role error:', error.message);
            throw error;
        },
    });

    //Helper Functions
    const createRole = async (roleData) => {
        return await createRoleMutation.mutateAsync(roleData);
    };

    return {
        getAllRoles: getAllRolesQuery.data,
        isLoadingRoles: getAllRolesQuery.isFetching,
        rolesError: getAllRolesQuery.error,
        refetchRoles: getAllRolesQuery.refetch,

        getAllPermissions: getAllPermissionsQuery.data,
        isLoadingPermissions: getAllPermissionsQuery.isFetching,
        permissionsError: getAllPermissionsQuery.error,
        refetchPermissions: getAllPermissionsQuery.refetch,

        createRole,
        isCreatingRole: createRoleMutation.isPending,
        createRoleError: createRoleMutation.error,
        createRoleSuccess: createRoleMutation.isSuccess,
        resetCreateRole: () => createRoleMutation.reset(),
    };
}