import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { terminalService } from "../services/terminal.service";

export const useTerminal = () => {
    const queryClient = useQueryClient();

    const createTerminalMutation = useMutation({
        mutationFn: async (terminalData) => {
            return await terminalService.createTerminal(terminalData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pos-terminal-list'] });
        },
        onError: (error) => {
            console.error('Create terminal error:', error.message);
            throw error;
        },
    });

    //Helper function to create terminal
    const createTerminal = async (terminalData) => {
        return createTerminalMutation.mutateAsync(terminalData);
    }


    //Get POS Terminal List
    const getPosTerminalList = useQuery({
        queryKey: ['pos-terminal-list'],
        queryFn: terminalService.getPosTerminalList,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    return {
        // Create terminal 
        createTerminal,

        isCreatingTerminal: createTerminalMutation.isPending,
        createTerminalError: createTerminalMutation.error,
        createTerminalSuccess: createTerminalMutation.isSuccess,
        resetCreateTerminal: createTerminalMutation.reset,

        // Get terminal list
        posTerminalList: getPosTerminalList.data,
        isLoadingPosTerminalList: getPosTerminalList.isFetching,
        posTerminalListError: getPosTerminalList.error,
        refetchPosTerminalList: getPosTerminalList.refetch,
    }
}