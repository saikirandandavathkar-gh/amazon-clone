
import { searchData } from "../data/searchData.js";
import { brandData } from "../data/brandData.js";

export function getSearch() {
    return searchData;
}

export function searchProducts(query, selectedCategory = "All") {
    const searchQuery = query.trim().toLowerCase();

    if (!searchQuery) {
        return [];
    }

    const results = [];

    Object.entries(brandData).forEach(([category, brands]) => {
        if (selectedCategory !== "All" && selectedCategory !== category) {
            return;
        }

        Object.values(brands).forEach(products => {
            products.forEach(product => {
                const title = product.title?.toLowerCase() || "";
                const brand = product.brand?.toLowerCase() || "";
                const productCategory = product.category?.toLowerCase() || "";
                const features = product.features?.join(" ").toLowerCase() || "";

                const matches =
                    title.includes(searchQuery) ||
                    features.includes(searchQuery) ||
                    brand.includes(searchQuery) ||
                    productCategory.includes(searchQuery);

                if (matches) {
                    results.push(product);
                }
            });
        });
    });

    return results;
}
