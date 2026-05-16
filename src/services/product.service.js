import { apiGet, apiPost, apiPostFormData} from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";

export const productService = {

  //Upload product thumbnail 
  uploadProductThumbnailImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiPostFormData(API_ENDPOINTS.UPLOAD_PRODUCT_THUMBNAIL, formData);

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

  //Upload product gallery images
  uploadProductGalleryImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiPostFormData(API_ENDPOINTS.UPLOAD_PRODUCT_GALLERY, formData);

    if(response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Images saved successfully",
      }
    } else {
      throw new Error(response.data?.message || "Failed to upload images")
    } 
  },

  //Upload product variant thumbnail
  uploadProductVariantThumbnail: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiPostFormData(API_ENDPOINTS.UPLOAD_PRODUCT_VARIANT_THUMBNAIL, formData);

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


  //Create product
  createProduct: async (productData) => {
    try {
      const response = await apiPost(API_ENDPOINTS.CREATE_PRODUCT, productData);

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Product created successfully",
        };
      } else {
        throw new Error(response.data?.message || "Failed to create product");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while creating product";
      throw new Error(message);
    }
  },

  //Get all products
  getAllProducts: async () => {
    try {
      const response = await apiGet(API_ENDPOINTS.GET_ALL_PRODUCTS);

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data?.message || "Failed to fetch products");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching products";
      throw new Error(message);
    }
  },

  //Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiGet(`${API_ENDPOINTS.GET_PRODUCT_BY_ID}/${productId}`);

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data?.message || "Failed to fetch product");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching product";
      throw new Error(message);
    }
  },
};
