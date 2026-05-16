import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllAttributes,
  getAllActiveAttributes,
  getAttributeById,
  createAttribute,
  createAttributeValue,
  updateAttribute,
  deleteAttribute,
  deleteAttributeValue,
} from '../services/attribute.service';

const QUERY_KEYS = {
  ATTRIBUTES: 'attributes',
  ATTRIBUTES_ACTIVE: 'attributes-active',
  ATTRIBUTE: 'attribute',
};

/**
 * Hook to fetch all attributes
 */
export function useGetAllAttributes(params = {}, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.ATTRIBUTES, params],
    queryFn: () => getAllAttributes(params),
    ...options,
  });
}

/**
 * Hook to fetch all active attributes
 */
export function useGetAllActiveAttributes(params = {}, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.ATTRIBUTES_ACTIVE, params],
    queryFn: () => getAllActiveAttributes(params),
    ...options,
  });
}

/**
 * Hook to fetch attribute by UUID
 */
export function useGetAttributeById(uuid, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.ATTRIBUTE, uuid],
    queryFn: () => getAttributeById(uuid),
    enabled: !!uuid,
    ...options,
  });
}

/**
 * Main attribute hook with all CRUD operations
 */
export function useAttribute() {
  const queryClient = useQueryClient();

  // Create attribute mutation
  const createAttributeMutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTES] });
    },
    onError: (error) => {
      console.error('Create attribute error:', error.message);
      throw error;
    },
  });

  // Create attribute value mutation
  const createAttributeValueMutation = useMutation({
    mutationFn: ({ attributeUuid, valueData }) =>
      createAttributeValue(attributeUuid, valueData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTE, variables.attributeUuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTES] });
    },
    onError: (error) => {
      console.error('Create attribute value error:', error.message);
      throw error;
    },
  });

  // Update attribute mutation
  const updateAttributeMutation = useMutation({
    mutationFn: ({ uuid, updateData }) => updateAttribute(uuid, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTE, variables.uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTES] });
    },
    onError: (error) => {
      console.error('Update attribute error:', error.message);
      throw error;
    },
  });

  // Delete attribute mutation
  const deleteAttributeMutation = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTES] });
    },
    onError: (error) => {
      console.error('Delete attribute error:', error.message);
      throw error;
    },
  });

  // Delete attribute value mutation
  const deleteAttributeValueMutation = useMutation({
    mutationFn: ({ attributeUuid, valueUuid }) =>
      deleteAttributeValue(attributeUuid, valueUuid),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTE, variables.attributeUuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTRIBUTES] });
    },
    onError: (error) => {
      console.error('Delete attribute value error:', error.message);
      throw error;
    },
  });

  // Helper wrapper functions
  const createNewAttribute = async (attributeData) => {
    return await createAttributeMutation.mutateAsync(attributeData);
  };

  const addAttributeValue = async (attributeUuid, valueData) => {
    return await createAttributeValueMutation.mutateAsync({ attributeUuid, valueData });
  };

  const updateExistingAttribute = async (uuid, updateData) => {
    return await updateAttributeMutation.mutateAsync({ uuid, updateData });
  };

  const removeAttribute = async (uuid) => {
    return await deleteAttributeMutation.mutateAsync(uuid);
  };

  const removeAttributeValue = async (attributeUuid, valueUuid) => {
    return await deleteAttributeValueMutation.mutateAsync({ attributeUuid, valueUuid });
  };

  return {
    // Create attribute
    createAttribute: createNewAttribute,
    isCreatingAttribute: createAttributeMutation.isPending,
    createAttributeError: createAttributeMutation.error,
    createAttributeSuccess: createAttributeMutation.isSuccess,
    resetCreateAttribute: createAttributeMutation.reset,

    // Create attribute value
    createAttributeValue: addAttributeValue,
    isCreatingAttributeValue: createAttributeValueMutation.isPending,
    createAttributeValueError: createAttributeValueMutation.error,
    createAttributeValueSuccess: createAttributeValueMutation.isSuccess,
    resetCreateAttributeValue: createAttributeValueMutation.reset,

    // Update attribute
    updateAttribute: updateExistingAttribute,
    isUpdatingAttribute: updateAttributeMutation.isPending,
    updateAttributeError: updateAttributeMutation.error,
    updateAttributeSuccess: updateAttributeMutation.isSuccess,
    resetUpdateAttribute: updateAttributeMutation.reset,

    // Delete attribute
    deleteAttribute: removeAttribute,
    isDeletingAttribute: deleteAttributeMutation.isPending,
    deleteAttributeError: deleteAttributeMutation.error,
    deleteAttributeSuccess: deleteAttributeMutation.isSuccess,
    resetDeleteAttribute: deleteAttributeMutation.reset,

    // Delete attribute value
    deleteAttributeValue: removeAttributeValue,
    isDeletingAttributeValue: deleteAttributeValueMutation.isPending,
    deleteAttributeValueError: deleteAttributeValueMutation.error,
    deleteAttributeValueSuccess: deleteAttributeValueMutation.isSuccess,
    resetDeleteAttributeValue: deleteAttributeValueMutation.reset,
  };
}