import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { DollarSign, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import SelectTableModal, { TableData } from "./SelectTableModal";
import { apiClient } from "@/lib/apiClient";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: any[];
  totalAmount: number;
}

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  onClose,
  currentOrder,
  totalAmount,
}) => {
  const [orderType, setOrderType] = useState("new_order");
  const [serviceType, setServiceType] = useState("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [isSelectTableModalOpen, setIsSelectTableModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceType === "dine_in" && !selectedTable) {
      toast.error("Please select a table for dine-in orders.");
      return;
    }

    try {
      const orderPayload = {
        order_type: orderType,
        service_type: serviceType,
        ...(serviceType === "dine_in" && { table_id: selectedTable?.id, table_number: selectedTable?.table_number }),
        ...(serviceType === "parcel" && { customer_name: customerName, phone_number: phoneNumber, delivery_address: deliveryAddress }),
        ...(serviceType === "complimentary" && { customer_name: customerName, phone_number: phoneNumber }),
        items: currentOrder.map((item) => ({
          product_id: item.product.id, // Assuming product has an id
          quantity: item.quantity,
          selling_price: item.unit_selling_price,
        })),
        total_amount: totalAmount,
      };
      console.log(orderPayload);

      const response = await apiClient.post(
        `https://pos-api-dev.mohajon.app/api/v1/store/orders`,
        orderPayload
      );

      if (response.data.success) {
        toast.success("Order created successfully!");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to create order.");
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Error creating order: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Confirm Order
          </DialogTitle>
          <DialogDescription>Review the order and confirm.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new_order">NEW ORDER</TabsTrigger>
              <TabsTrigger value="new_kot">NEW KOT</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={serviceType === "dine_in" ? "default" : "outline"}
              onClick={() => setServiceType("dine_in")}
            >
              Dine-In
            </Button>
            <Button
              type="button"
              variant={serviceType === "parcel" ? "default" : "outline"}
              onClick={() => setServiceType("parcel")}
            >
              Parcel
            </Button>
            <Button
              type="button"
              variant={serviceType === "complimentary" ? "default" : "outline"}
              onClick={() => setServiceType("complimentary")}
            >
              Complimentary
            </Button>
          </div>

          {serviceType === "dine_in" && (
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal text-gray-500 cursor-pointer"
                onClick={() => setIsSelectTableModalOpen(true)}
              >
                {selectedTable ? selectedTable.name : "Select Table"}
              </Button>
            </div>
          )}

          {(serviceType === "parcel" || serviceType === "complimentary") && (
            <div className="grid gap-2">
              <Input
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                placeholder="Phone Number (Optional)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {serviceType === "parcel" && (
                <Input
                  placeholder="Delivery Address (Optional)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              )}
            </div>
          )}

          <ScrollArea className="h-40 w-full rounded-md border p-4">
            <div className="space-y-4">
              {currentOrder.length === 0 ? (
                <p className="text-center text-gray-500">No items in order.</p>
              ) : (
                currentOrder.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
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
                          ৳{(item.unit_selling_price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm">Qty: {item.quantity}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>৳{totalAmount.toFixed(2)}</span>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
              <UtensilsCrossed className="mr-2 h-4 w-4" /> Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <SelectTableModal
        isOpen={isSelectTableModalOpen}
        onClose={() => setIsSelectTableModalOpen(false)}
        onSelectTable={(table) => {
          setSelectedTable(table);
          setTableNumber(table.table_number); // Update tableNumber state as well
        }}
      />
    </Dialog>
  );
};

export default ConfirmOrderModal;