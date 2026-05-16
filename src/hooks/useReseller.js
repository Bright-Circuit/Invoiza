import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { resellerService } from "../services/reseller.service"

export const useReseller = () => {
    const queryClient = useQueryClient();

    //Get All resellers
    const getAllResellersQuery = useQuery({
        queryKey: ['resellers'],
        queryFn: resellerService.getAllResellers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    //Get reseller by ID - This is a hook factory function that returns a hook
    const useGetResellerById = (resellerId) => {
        return useQuery({
            queryKey: ['reseller', resellerId],
            queryFn: () => resellerService.getResellerById(resellerId),
            enabled: !!resellerId,
            staleTime: 0, 
        });
    };

    //Approve or reject reseller - Mutation
    const approveOrRejectMutation = useMutation({
        mutationFn: ({ resellerId, payload }) => resellerService.approveOrRejectReseller(resellerId, payload),
        onSuccess: () => {
            // Invalidate both queries to refetch updated data
            queryClient.invalidateQueries({ queryKey: ['resellers'] });
            queryClient.invalidateQueries({ queryKey: ['reseller'] });
        },
    });

    //Reactivate reseller - Mutation
    const deactivateResellerMutation = useMutation({
        mutationFn: ({ resellerId, suspensionReason }) => resellerService.deactivateReseller(resellerId, suspensionReason),
        onSuccess: () => {
            // Invalidate both queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['resellers'] });
            queryClient.invalidateQueries({ queryKey: ['reseller'] });
        },
    });

    // Activate reseller - Mutation
    const activateResellerMutation = useMutation({
        mutationFn: ({ resellerId }) => resellerService.activateReseller(resellerId),   
        onSuccess: () => {
            // Invalidate both queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['resellers'] });
            queryClient.invalidateQueries({ queryKey: ['reseller'] });
        },
    });

    return {
        //Queries
        getAllResellers: getAllResellersQuery.data,
        isLoadingResellers: getAllResellersQuery.isFetching,
        resellersError: getAllResellersQuery.error,
        refetchResellers: getAllResellersQuery.refetch,

        // Hook factory for getting reseller by ID
        useGetResellerById,

        // Mutations
        approveOrRejectReseller: approveOrRejectMutation.mutate,
        isApprovingOrRejecting: approveOrRejectMutation.isPending,
        approveOrRejectError: approveOrRejectMutation.error,
        approveOrRejectSuccess: approveOrRejectMutation.isSuccess,

         // deactivate mutation
        deactivateReseller: deactivateResellerMutation.mutate,
        isDeactivating: deactivateResellerMutation.isPending,
        deactivateError: deactivateResellerMutation.error,
        deactivateSuccess: deactivateResellerMutation.isSuccess,

         // activate mutation
        activateReseller: activateResellerMutation.mutate,
        isActivating: activateResellerMutation.isPending,
        activateError: activateResellerMutation.error,
        activateSuccess: activateResellerMutation.isSuccess,
    };
}