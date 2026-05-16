import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from '../services/category.service';

export const useCategory = () => {
    const queryClient = useQueryClient();

    const createCategoryMutation = useMutation({
        mutationFn: async ({ imageFile, categoryData }) => {
            // 1. Upload category image first if provided
            let imageUrl = "";
            if (imageFile) {
                const imageResponse = await categoryService.uploadCategoryImage(imageFile);
                // Try different possible property names that the API might return
                imageUrl = imageResponse?.data?.imageUrl || 
                          imageResponse?.data?.imageName || 
                          imageResponse?.data?.fileName || 
                          imageResponse?.data || 
                          "";
                
                console.log('Image upload response:', imageResponse);
                console.log('Extracted imageUrl:', imageUrl);
            }

            // 2. Create category payload with image URL
            const payload = {
                name: categoryData.name,
                slug: categoryData.slug,
                parentCategoryUuid: categoryData.parentCategoryUuid || null,
                imageUrl: imageUrl
            };

            console.log('Category payload:', payload);

            // 3. Create category
            return await categoryService.createCategory(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
        },
        onError: (error) => {
            console.error('Create category error:', error.message);
            throw error;
        },
    });

    const getAllMainCategoriesQuery = useQuery({
        queryKey: ['main-categories'],
        queryFn: categoryService.getAllMainCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

     // -------- List Categories --------
    const getAllCategoriesQuery = useQuery({
        queryKey: ['all-categories'],
        queryFn: categoryService.getAllCategories,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    //Get all category hierarchy
    const getAllCategoryHierarchyQuery = useQuery({
        queryKey: ['category-hierarchy'],
        queryFn: categoryService.getAllCategoryHierarchy,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    //Get category by id
    const useGetCategoryById = (categoryId) => {
        return useQuery({
            queryKey: ['category', categoryId],
            queryFn: () => categoryService.getCategoryById(categoryId),
            enabled: !!categoryId,
        });
    }

    //Helper Functions
    const createCategory = async ({ imageFile, categoryData }) => {
        return createCategoryMutation.mutateAsync({ imageFile, categoryData });
    }

    // Direct API call to fetch category by ID
    const getCategoryById = async (categoryId) => {
        try {
            return await categoryService.getCategoryById(categoryId);
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    }

    //Update category
    const updateCategory = async (categoryId, categoryData) => {
        return await categoryService.updateCategory(categoryId, categoryData);
    }

    return {
        //Mutations
        createCategory,

        //Mutation states 
        isCreatingCategory: createCategoryMutation.isPending,
        createCategoryError: createCategoryMutation.error,
        isSuccess: createCategoryMutation.isSuccess,
        
        //Mutation Reset functions
        resetCreateCategory: () => createCategoryMutation.reset(),

        //Queries
        getAllMainCategories: getAllMainCategoriesQuery.data,
        isLoadingMainCategories: getAllMainCategoriesQuery.isFetching,
        mainCategoriesError: getAllMainCategoriesQuery.error,
        refetchMainCategories: getAllMainCategoriesQuery.refetch,

        //List Categories Queries
        getAllCategories: getAllCategoriesQuery.data,
        isLoadingAllCategories: getAllCategoriesQuery.isFetching,
        AllCategoriesError: getAllCategoriesQuery.error,
        refetchAllCategories: getAllCategoriesQuery.refetch,

        //Category Hierarchy Queries
        getAllCategoryHierarchy: getAllCategoryHierarchyQuery.data,
        isLoadingCategoryHierarchy: getAllCategoryHierarchyQuery.isFetching,
        categoryHierarchyError: getAllCategoryHierarchyQuery.error,
        refetchCategoryHierarchy: getAllCategoryHierarchyQuery.refetch,
    
        //Hook factory function
        useGetCategoryById,

        //Direct API call
        getCategoryById,

        //Update category
        updateCategory,
    }
};