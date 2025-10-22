import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  currentOrder: any[];
  onPlaceOrder: (orderDetails: any) => void;
}

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  currentOrder,
  onPlaceOrder,
}) => {
  const [receivedAmount, setReceivedAmount] = useState<number>(subtotal ?? 0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [printReceipt, setPrintReceipt] = useState<boolean>(false);
  const [receivable, setReceivable] = useState<number>(subtotal ?? 0);
  const [due, setDue] = useState<number>(0);

  useEffect(() => {
    setReceivedAmount(subtotal ?? 0);
    setReceivable(subtotal ?? 0);
  }, [subtotal]);

  useEffect(() => {
    const newReceivable = (subtotal ?? 0) - (discount ?? 0);
    setReceivable(newReceivable);
    setDue(newReceivable - (receivedAmount ?? 0));
  }, [subtotal, discount, receivedAmount]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="receivedAmount" className="text-sm font-medium">
                Received Amount
              </label>
              <Input
                id="receivedAmount"
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label htmlFor="discount" className="text-sm font-medium">
                Discount
              </label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          {discount > receivable && (
            <p className="text-red-500 text-sm">
              Note: Discount amount can't be greater than - ৳{(receivable ?? 0).toFixed(2)}.
            </p>
          )}

          <div className="grid gap-2">
            <label htmlFor="paymentMethod" className="text-sm font-medium">
              Payment Method
            </label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold">Order Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳{(subtotal ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>৳{(discount ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Receivable:</span>
              <span>৳{(receivable ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Due:</span>
              <span>৳{(due ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="printReceipt"
              checked={printReceipt}
              onCheckedChange={(checked) => setPrintReceipt(checked as boolean)}
            />
            <label
              htmlFor="printReceipt"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Print Receipt on Order Completion
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              onClick={() =>
                onPlaceOrder({
                  subtotal,
                  receivedAmount,
                  discount,
                  paymentMethod,
                  printReceipt,
                  receivable,
                  due,
                  currentOrder,
                })
              }
            >
              Place Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrderModal;
