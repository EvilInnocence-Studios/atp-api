<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'app/Mage.php';
Mage::app();

try {
    // Configure pagination
    $pageSize = 100; // Number of customers per batch
    $currentPage = 1;

    // Calculate total pages
    $customerCollection = Mage::getModel('customer/customer')->getCollection();
    $totalCustomers = $customerCollection->getSize();
    $totalPages = ceil($totalCustomers / $pageSize);

    // Start JSON output
    header('Content-Type: application/json');
    echo "[";

    $firstItem = true;

    while ($currentPage <= $totalPages) {
        // Load a subset of customers
        $customers = Mage::getModel('customer/customer')->getCollection()
            ->addAttributeToSelect('email')
            ->addAttributeToSelect('group_id')
            ->addAttributeToSelect('created_at')
            ->addAttributeToSelect('prefix')
            ->addAttributeToSelect('firstname')
            ->addAttributeToSelect('lastname')
            ->addAttributeToSelect('suffix')
            ->addAttributeToSelect('password_hash')
            ->addAttributeToSelect('middlename')
            ->setPageSize($pageSize)
            ->setCurPage($currentPage);

        foreach ($customers as $customer) {
            if (!$firstItem) {
                echo ",";
            } else {
                $firstItem = false;
            }

            // Get basic customer data
            $customerData = $customer->getData();

            // Get address information
            // $addresses = $customer->getAddresses();
            // $addressData = [];

            // foreach ($addresses as $address) {
            //     $addressData[] = $address->getData();
            // }

            // $customerData['addresses'] = $addressData;

            // Get order information
            $orders = Mage::getModel('sales/order')->getCollection()
                ->addAttributeToSelect('entity_id')
                ->addAttributeToSelect('status')
                ->addAttributeToSelect('coupon_code')
                ->addAttributeToSelect('discount_amount')
                ->addAttributeToSelect('grand_total')
                ->addAttributeToSelect('subtotal')
                ->addAttributeToSelect('created_at')
                ->addFieldToFilter('customer_id', $customer->getId());

            // For each order, add the line item details
            $customerData['orders'] = [];
            foreach ($orders as $order) {
                $orderData = $order->getData();
                $orderItems = Mage::getModel('sales/order_item')->getCollection()
                    ->addAttributeToSelect('sku')
                    ->addFieldToFilter('order_id', $order->getId());
                $orderData['items'] = [];
                $items = $orderItems->getData();
                foreach($items as $item) {
                    $orderData['items'][] = $item['sku'];
                }
                $customerData['orders'][] = $orderData;
            }

            // Output customer data
            echo json_encode($customerData);
        }

        $currentPage++;
    }

    echo "]";
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}