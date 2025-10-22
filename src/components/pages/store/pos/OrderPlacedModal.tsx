import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface OrderPlacedModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: any;
}

const OrderPlacedModal: React.FC<OrderPlacedModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Placed Successfully!</DialogTitle>
          <DialogDescription>
            Your order has been placed. Here are the details:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <Image
              src="/images/order-success.png"
              alt="Order Success"
              width={150}
              height={150}
            />
          </div>
          <div className="space-y-2">
            <p><strong>Subtotal:</strong> ৳{(orderDetails.subtotal ?? 0).toFixed(2)}</p>
            <p><strong>Discount:</strong> ৳{(orderDetails.discount ?? 0).toFixed(2)}</p>
            <p><strong>Receivable:</strong> ৳{(orderDetails.receivable ?? 0).toFixed(2)}</p>
            <p><strong>Received Amount:</strong> ৳{(orderDetails.receivedAmount ?? 0).toFixed(2)}</p>
            <p><strong>Due:</strong> ৳{(orderDetails.due ?? 0).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
            <p><strong>Print Receipt:</strong> {orderDetails.printReceipt ? "Yes" : "No"}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {orderDetails.currentOrder && orderDetails.currentOrder.map((item: any) => (
                <li key={item.id}>{item.product.name} x {item.quantity}</li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={() => console.log("Navigate to Orders Page")}>View Orders</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPlacedModal;