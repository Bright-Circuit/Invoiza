import { apiGet, apiPost, apiPostFormData, apiPut } from '../api/apiManager';
import { API_ENDPOINTS } from '../utils/constants';

export const categoryService = {

    //Upload Category image
    uploadCategoryImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiPostFormData(API_ENDPOINTS.UPLOAD_CATEGORY_IMAGE, formData);

        if(response.data?.success) {
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Image saved successfully",
            }
        } else {
            throw new Error(response.data?.message || "Failed to upload image")
        }
    },

    //Create category
    createCategory: async (categoryData) => {
        try {
            const response = await apiPost(API_ENDPOINTS.CREATE_CATEGORY, categoryData);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Category created successfully',
                };
            } else {
                throw new Error(response.data?.message || 'Failed to create category');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while creating category';
            throw new Error(message);
        }
    },

    //Get all main categories
    getAllMainCategories: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_ALL_MAIN_CATEGORIES);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || 'Failed to fetch categories');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching categories';
            throw new Error(message);
        }
    },

    //Get all categories
    getAllCategories: async () =>{
        try{
            const response = await apiGet(API_ENDPOINTS.GET_ALL_CATEGORIES) ;

            if (response.data?.success){
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,

                };
            } else {
                throw new Error(response.data?.message || 'Failed to fetch categories');
            }
        } catch(error){
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching categories';
            throw new Error(message);
        }
    },

    //Get all category hierarchy
    getAllCategoryHierarchy: async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.GET_ALL_CATEGORY_HIERARCHY);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || 'Failed to fetch categories');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching categories';
            throw new Error(message);
        }
    },

    //get category by id
    getCategoryById: async (categoryId) => {
        try {
            const response = await apiGet(`${API_ENDPOINTS.GET_CATEGORY_BY_ID}/${categoryId}`);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } else {
                throw new Error(response.data?.message || 'Failed to fetch category');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while fetching category';
            throw new Error(message);
        }
    },
    //Update category
    updateCategory: async (categoryId, categoryData) => {
        try {
            const response = await apiPut(`${API_ENDPOINTS.UPDATE_CATEGORY}/${categoryId}`, categoryData);

            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Category updated successfully',
                };
            } else {
                throw new Error(response.data?.message || 'Failed to update category');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while updating category';
            throw new Error(message);
        }
    },
};




