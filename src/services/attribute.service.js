import { apiGet, apiPost, apiPut, apiDelete } from "../api/apiManager";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Get all attributes
 */
export async function getAllAttributes(params = {}) {
  try {
    const response = await apiGet(API_ENDPOINTS.GET_ALL_ATTRIBUTES, { params });

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data?.message || "Failed to fetch attributes");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching attributes";
    throw new Error(message);
  }
}

/**
 * Get all active attributes
 */
export async function getAllActiveAttributes(params = {}) {
  try {
    const response = await apiGet(API_ENDPOINTS.GET_ALL_ACTIVE_ATTRIBUTES, {
      params,
    });

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(
      response.data?.message || "Failed to fetch active attributes",
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching active attributes";
    throw new Error(message);
  }
}

/**
 * Get attribute by UUID
 */
export async function getAttributeById(uuid) {
  try {
    const endpoint = API_ENDPOINTS.GET_ATTRIBUTE_BY_ID.replace("{uuid}", uuid);
    const response = await apiGet(endpoint);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data?.message || "Failed to fetch attribute");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching attribute";
    throw new Error(message);
  }
}

/**
 * Create attribute
 */
export async function createAttribute(attributeData) {
  console.log(attributeData);

  try {
    // Transform data to match API format
    const payload = {
      attributeName: attributeData.name || attributeData.attributeName,
      values: Array.isArray(attributeData.values)
        ? attributeData.values.map((v) => (typeof v === "string" ? v : v.value))
        : [],
    };

    const response = await apiPost(API_ENDPOINTS.CREATE_ATTRIBUTE, payload);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Attribute created successfully",
      };
    }

    throw new Error(response.data?.message || "Failed to create attribute");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while creating attribute";
    throw new Error(message);
  }
}

/**
 * Create attribute value
 */
export async function createAttributeValue(attributeUuid, valueData) {
  try {
    const endpoint = API_ENDPOINTS.CREATE_ATTRIBUTE_VALUE.replace(
      "{attributeUuid}",
      attributeUuid,
    );
    const response = await apiPost(endpoint, valueData);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message:
          response.data.message || "Attribute value created successfully",
      };
    }

    throw new Error(
      response.data?.message || "Failed to create attribute value",
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while creating attribute value";
    throw new Error(message);
  }
}

/**
 * Update attribute 
 */
export async function updateAttribute(uuid, updateData) {
  try {
    const endpoint = API_ENDPOINTS.UPDATE_ATTRIBUTE.replace("{uuid}", uuid);
    const response = await apiPut(endpoint, updateData);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Attribute updated successfully",
      };
    }

    throw new Error(response.data?.message || "Failed to update attribute");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while updating attribute";
    throw new Error(message);
  }
}

/**
 * Delete attribute
 */
export async function deleteAttribute(uuid) {
  try {
    const endpoint = API_ENDPOINTS.DELETE_ATTRIBUTE.replace("{uuid}", uuid);
    const response = await apiDelete(endpoint);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Attribute deleted successfully",
      };
    }

    throw new Error(response.data?.message || "Failed to delete attribute");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while deleting attribute";
    throw new Error(message);
  }
}

/**
 * Delete attribute value
 */
export async function deleteAttributeValue(attributeUuid, valueUuid) {
  try {
    const endpoint = API_ENDPOINTS.DELETE_ATTRIBUTE_VALUE.replace(
      "{attributeUuid}",
      attributeUuid,
    ).replace("{valueUuid}", valueUuid);
    const response = await apiDelete(endpoint);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message:
          response.data.message || "Attribute value deleted successfully",
      };
    }

    throw new Error(
      response.data?.message || "Failed to delete attribute value",
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while deleting attribute value";
    throw new Error(message);
  }
}
