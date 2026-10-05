import { brandData } from "../data/brandData.js";

export function getBrandProducts(category, brand) {
    return brandData?.[category]?.[brand] || [];
}

export function getProduct(productId) {
    for (const brands of Object.values(brandData)) {
        for (const products of Object.values(brands)) {
            const product = products.find(productData => String(productData.id) === String(productId));

            if (product) {
                return product;
            }
        }
    }

    return null;
}