<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'app/Mage.php';
Mage::app();

$category_cache = [];

try {
    // Configure pagination
    $pageSize = 100; // Number of products per batch
    $currentPage = 1;

    // Calculate total pages
    $productCollection = Mage::getModel('catalog/product')->getCollection();
    $totalProducts = $productCollection->getSize();
    $totalPages = ceil($totalProducts / $pageSize);

    // Start JSON output
    header('Content-Type: application/json');
    echo "[";

    $firstItem = true;

    while ($currentPage <= $totalPages) {
        // Load a subset of products
        $products = Mage::getModel('catalog/product')->getCollection()
            ->addAttributeToSelect('*') // Select all attributes
            ->setPageSize($pageSize)
            ->setCurPage($currentPage);

        foreach ($products as $product) {
            if (!$firstItem) {
                echo ",";
            } else {
                $firstItem = false;
            }

            // Get basic product data
            $productData = $product->getData();

            // If the product is downloadable, include downloadable links
            if ($product->getTypeId() == 'downloadable') {
                $downloadableLinks = [];

                $links = Mage::getModel('downloadable/link')
                    ->getCollection()
                    ->addFieldToFilter('product_id', $product->getId());

                foreach ($links as $link) {
                    $downloadableLinks[] = $link->getData(); // Get all link data
                }

                $productData['downloadable_links'] = $downloadableLinks;
            }

            // Get image information
            $product->load('media_gallery');
            $images = $product->getMediaGalleryImages();
            $productData['images'] = [];
            foreach ($images as $image) {
                $productData['images'][] = $image->getFile();
            }

            // Get category information
            $categoryIds = $product->getCategoryIds();
            $categories = [];
            if (!empty($categoryIds)) {
                foreach ($categoryIds as $categoryId) {
                    if (!isset($categoryCache[$categoryId])) {
                        $category = Mage::getModel('catalog/category')->load($categoryId);
                        $categoryCache[$categoryId] = [
                            'id' => $category->getId(),
                            'name' => $category->getName(),
                            'url_key' => $category->getUrlKey(),
                            'path' => $category->getPath(),
                        ];
                    }
                    $categories[] = $categoryCache[$categoryId];
                }
            }
            $productData['categories'] = $categories;

            // Get related product info
            $related = Mage::getModel('catalog/product_link')
                ->getCollection()
                ->addFieldToFilter('product_id', $product->getId());
            $productData['related_products'] = [];
            foreach($related as $relatedProduct) {
                $productData['related_products'][] = $relatedProduct->getData();
            }

            // Stream product data as JSON
            echo json_encode($productData, JSON_PRETTY_PRINT);
        }

        // Clear memory used by the current collection
        $products->clear();

        // Increment the page number
        $currentPage++;
    }

    // End JSON output
    echo "]";

} catch (Exception $e) {
    // Handle exceptions
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}
