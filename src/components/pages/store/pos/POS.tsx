"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useInventories } from "@/hooks/useInventories";
import Image from "next/image";
import AddMenuItemForm from "./AddMenuItemForm";
import ConfirmOrderModal from "./ConfirmOrderModal";
import OrderPlacedModal from "./OrderPlacedModal";
import { useRouter } from "next/navigation";

const POS = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useInventories(currentPage, 10);
  const menuItems = data?.inventories || [];
  const totalPages = Math.ceil((data?.total || 0) / 10);
  const router = useRouter();

  const [currentOrder, setCurrentOrder] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAddMenuFormOpen, setIsAddMenuFormOpen] = useState(false);
  const [isConfirmOrderModalOpen, setIsConfirmOrderModalOpen] = useState(false);
  const [isOrderPlacedModalOpen, setIsOrderPlacedModalOpen] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  const handlePlaceOrder = async (orderDetails: any) => {
    console.log("Order Placed:", orderDetails);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    // Assuming the API call was successful
    setIsConfirmOrderModalOpen(false); // Close the confirmation modal
    setPlacedOrderDetails(orderDetails);
    setIsOrderPlacedModalOpen(true); // Open the order placed modal
    setCurrentOrder([]); // Clear the current order

    // Navigate to the orders page after a short delay to allow the modal to be seen
    setTimeout(() => {
      router.push("/store/orders"); // Adjust this path to your actual orders page
    }, 2000);
  };

  useEffect(() => {
    const newTotal = currentOrder.reduce(
      (sum, item) => sum + item.unit_selling_price * item.quantity,
      0
    );
    setTotalAmount(newTotal);
  }, [currentOrder]);

  const addToCart = (item: any) => {
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find(
        (orderItem) => orderItem.id === item.id
      );
      if (existingItem) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prevOrder, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    setCurrentOrder((prevOrder) => {
      if (newQuantity <= 0) {
        return prevOrder.filter((item) => item.id !== itemId);
      }
      return prevOrder.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (itemId: number) => {
    setCurrentOrder((prevOrder) =>
      prevOrder.filter((item) => item.id !== itemId)
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full p-4 lg:p-6 gap-4 lg:gap-6">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <h2 className="text-2xl font-bold mb-5">All Items</h2>
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex justify-between w-full items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search" className="pl-8" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div>Loading items...</div>
          ) : isError ? (
            <div>Error loading items.</div>
          ) : (
            menuItems.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart(item)}
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={120}
                    height={120}
                    className="h-32 w-52 object-cover rounded-md mb-4"
                  />
                  <p className="text-xl uppercase font-semibold mb-1 truncate w-full text-center">
                    {item.product.name}
                  </p>
                  <div className="text-sm text-gray-700 mb-2 rounded space-y-2 border p-3">
                    <div className="flex justify-between gap-10 ">
                      <p>
                        Selling Price:{" "}
                        <span className="font-bold">
                          ৳{(item.unit_selling_price || 0).toFixed(2)}
                        </span>
                      </p>
                      <p>
                        Unit Price:{" "}
                        <span className="font-bold">
                          ৳{(item.unit_price || 0).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-10 justify-between">
                      <p>
                        Quantity Left:{" "}
                        <span className="font-bold">{item.quantity_left}</span>
                      </p>
                      <p>
                        Unit Size:{" "}
                        <span className="font-bold">{item.unit_size}</span>
                      </p>
                    </div>
                    <p>
                      Unit Title:{" "}
                      <span className="font-bold">{item.unit_title}</span>
                    </p>
                  </div>
                  <Button
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              variant={currentPage === index + 1 ? "default" : "outline"}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Right Panel - Order Summary */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l p-4 mt-6 lg:mt-0">
        <Card className="min-h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Current Order</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-4">
                {currentOrder.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          ৳{(item.unit_selling_price || 0).toFixed(2)} x{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col p-4 border-t gap-4">
            <div className="flex justify-between w-full text-lg font-semibold">
              <span>Total:</span>
              <span>৳{totalAmount.toFixed(2)}</span>
            </div>
            <Button
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsConfirmOrderModalOpen(true)}
              disabled={currentOrder.length === 0}
            >
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
      <AddMenuItemForm
        isOpen={isAddMenuFormOpen}
        onClose={() => setIsAddMenuFormOpen(false)}
      />
      <ConfirmOrderModal
        isOpen={isConfirmOrderModalOpen}
        onClose={() => setIsConfirmOrderModalOpen(false)}
        subtotal={totalAmount}
        currentOrder={currentOrder}
        onPlaceOrder={handlePlaceOrder}
      />
      {placedOrderDetails && (
        <OrderPlacedModal
          isOpen={isOrderPlacedModalOpen}
          onClose={() => setIsOrderPlacedModalOpen(false)}
          orderDetails={placedOrderDetails}
        />
      )}
    </div>
  );
};

export default POS;
