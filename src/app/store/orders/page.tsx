"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, DollarSign, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useOrders, Order } from "@/hooks/useOrders";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function OrderPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [searchConsignmentId, setSearchConsignmentId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const { data, isLoading, isError, error } = useOrders(
    page,
    limit,
    searchConsignmentId,
    searchCustomer,
    sortBy
  );

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.original.orderNumber}</div>
          <div className="text-sm text-gray-500">
            {new Date(row.original.createdAt).toLocaleDateString()} {" "}
            {new Date(row.original.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.customer;
        return (
          <div>
            {customer?.name || "Walk-in Customer"}
            {customer?.phone_number && (
              <div className="text-sm text-gray-500">
                {customer.phone_number}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Billing",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "BDT", // Assuming BDT based on image
        }).format(amount);
        const status = row.original.paymentStatus === "PAID" ? "Received" : "Due";
        const statusColor = row.original.paymentStatus === "PAID" ? "text-green-600" : "text-red-600";

        const billingDetails = row.original.billingDetails;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-1 cursor-pointer">
                <DollarSign className={`h-4 w-4 ${statusColor}`} />
                <span className={`font-medium ${statusColor}`}>{formatted} - {status}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="text-lg font-semibold mb-2">Order Billing Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total</div>
                <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(billingDetails?.total || 0)}</div>

                <div>Received</div>
                <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(billingDetails?.received || 0)}</div>

                <div>Due</div>
                <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(billingDetails?.due || 0)}</div>

                <div>Discount Applied</div>
                <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(billingDetails?.discountApplied || 0)}</div>

                <div>Amount</div>
                <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(billingDetails?.amount || 0)}</div>

                <div>Receivable</div>
                <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(billingDetails?.receivable || 0)}</div>

                <div>Payment Method</div>
                <div className="text-right">{billingDetails?.paymentMethod || "N/A"}</div>
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const statusColor = status === "PAID" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {String(status).toUpperCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => {
        const createdBy = row.original.created_by;
        return (
          <div className="flex items-center space-x-2">
            {/* Placeholder for avatar/icon */}
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
              {createdBy?.name ? createdBy.name[0] : "?"}
            </div>
            <span>{createdBy?.name || "N/A"} (You)</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        console.log(order);
        return (
          <div className="flex items-center space-x-2">
            {order.status === "DUE" && (
              <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                <DollarSign className="mr-2 h-4 w-4" /> Clear Due
              </Button>
            )}
            <Button variant="outline" size="sm">
              Print Receipt
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(order.orderNumber)}
                >
                  Copy order ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View order details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Copy className="mr-2 h-4 w-4" /> Place Order
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Search by consignment ID"
          className="max-w-sm"
          value={searchConsignmentId}
          onChange={(e) => setSearchConsignmentId(e.target.value)}
        />
        <Input
          placeholder="Search Customer"
          className="max-w-sm"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Order Date</SelectItem>
            <SelectItem value="totalAmount">Total Amount</SelectItem>
            {/* Add more sort options as needed */}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={data?.data?.orders || []} />
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
