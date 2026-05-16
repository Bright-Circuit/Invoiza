import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from '../services/product.service';

export const useProducts = () => {
    const queryClient = useQueryClient();

    const createProductMutation = useMutation({
        mutationFn: async ({ thumbnailFile, galleryFiles, variantThumbnails, productData }) => {
            // 1. Upload thumbnail image first
            let thumbnailImageName = "";
            if (thumbnailFile) {
                const thumbnailResponse = await productService.uploadProductThumbnailImage(thumbnailFile);
                thumbnailImageName = thumbnailResponse?.data?.imageUrl || "";
            }

            // 2. Upload gallery images
            let galleryImages = [];
            if (galleryFiles && galleryFiles.length > 0) {
                const galleryResponse = await productService.uploadProductGalleryImages(galleryFiles);
                const imageNames = galleryResponse?.data?.imageUrl || galleryResponse?.data || [];
                if (Array.isArray(imageNames)) {
                    galleryImages = imageNames.map((mediaName, index) => ({
                        mediaName: typeof mediaName === 'string' ? mediaName : mediaName?.imageUrl || "",
                        sortOrder: index,
                        altText: "",
                        mimeType: "image/jpeg"
                    }));
                }
            }

            // 3. Upload variant thumbnails if any
            let variantImages = {};
            if (variantThumbnails && Object.keys(variantThumbnails).length > 0) {
                for (const [variantId, file] of Object.entries(variantThumbnails)) {
                    if (file) {
                        const variantResponse = await productService.uploadProductVariantThumbnail(file);
                        variantImages[variantId] = variantResponse?.data?.imageUrl || "";
                    }
                }
            }

            // 4. Create product payload
            const payload = {
                sku: productData.sku,
                title: productData.title,
                slug: productData.slug,
                shortDescription: productData.shortDescription || "",
                description: productData.description || "",
                categoryUuid: productData.categoryUuid,
                thumbnailImageName: thumbnailImageName,
                showcasePrice: parseFloat(productData.showcasePrice) || 0,
                salePrice: parseFloat(productData.salePrice) || 0,
                saleStart: productData.saleStart || null,
                saleEnd: productData.saleEnd || null,
                productType: productData.productType,
                featured: productData.featured || false,
                visibility: productData.visibility || "public",
                soldIndividually: productData.soldIndividually || false,
                pricingMode: productData.pricingMode || "standard",
                wholesalePrice: parseFloat(productData.wholesalePrice) || 0,
                wholesaleMinQty: parseInt(productData.wholesaleMinQty) || 0,
                productionCost: parseFloat(productData.productionCost) || 0,
                resellerPrice: parseFloat(productData.resellerPrice) || 0,
                isPublish: productData.isPublish,
                initialStockQuantity: parseInt(productData.initialStockQuantity) || 0,
                inventoryStatus: productData.inventoryStatus || "instock",
                tagUuids: productData.tagUuids || [],
                linkedProducts: productData.linkedProducts || [],
                galleryImages: galleryImages,
                meta: productData.meta || {},
                dimension: productData.dimension || {},
                attributeSelections: productData.attributeSelections || [],
                variants: productData.variants ? productData.variants.map(variant => {
                    // Remove the local 'id' field and add thumbnailImageName
                    const { id, ...variantWithoutId } = variant;
                    return {
                        ...variantWithoutId,
                        thumbnailImageName: variantImages[id] || ""
                    };
                }) : []
            };

            // 5. Create product
            return await productService.createProduct(payload);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            console.log('Product created successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to create product:', error.message);
            throw error;
        },
    });

    const getAllProductsQuery = useQuery({
        queryKey: ['products'],
        queryFn: productService.getAllProducts,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    //Get product by ID - This is a hook factory function that returns a hook
    const useGetProductById = (productId) => {
        return useQuery({
            queryKey: ['product', productId],
            queryFn: () => productService.getProductById(productId),
            enabled: !!productId,
        });
    };


    //Helper Functions
    const createProduct = async ({ thumbnailFile, galleryFiles, variantThumbnails, productData }) => {
        return createProductMutation.mutateAsync({ thumbnailFile, galleryFiles, variantThumbnails, productData });
    }


    return {
        //Mutations
        createProduct,

        //Mutation states 
        isCreatingProduct: createProductMutation.isPending,
        createProductError: createProductMutation.error,
        isSuccess: createProductMutation.isSuccess,

        //Mutation Reset functions
        resetCreateProduct: () => createProductMutation.reset(),

        //Queries
        getAllProducts: getAllProductsQuery.data,
        isLoadingProducts: getAllProductsQuery.isFetching,
        productsError: getAllProductsQuery.error,
        refetchProducts: getAllProductsQuery.refetch,

        //Hook factory function
        useGetProductById,
    }

    
}