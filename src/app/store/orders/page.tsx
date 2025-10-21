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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function OrderPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchOrderUid, setSearchOrderUid] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const { data, isLoading, isError, error } = useOrders(
    page,
    limit,
    searchOrderUid,
    searchCustomer,
    sortBy
  );

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_uid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order UID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.original.order_uid}</div>
          <div className="text-sm text-gray-500">
            {new Date(row.original.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}{" "}
            {new Date(row.original.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex justify-between w-full cursor-pointer"
        >
          Created By
          <span>
            <ArrowUpDown />
          </span>
        </Button>
      ),
      cell: ({ row }) => {
        const createdBy = row.original.created_by;
        return (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              {/* Placeholder for avatar/icon */}
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                {createdBy?.name ? createdBy.name[0] : "?"}
              </div>
              <span>{createdBy?.name || "N/A"} (You)</span>
            </div>
            {createdBy?.phone_number && (
              <div className="text-sm text-gray-500 ml-8">
                {createdBy.phone_number}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const orderStatus = row.original.status;
        const paymentStatus = row.original.paymentStatus;

        const getStatusColor = (status: string) => {
          switch (status) {
            case "BILL CREATED":
            case "PROCESSING":
              return "text-orange-600";
            case "COMPLETED":
            case "PAID":
              return "text-green-600";
            case "CANCELLED":
            case "DUE":
              return "text-red-600";
            default:
              return "text-gray-600";
          }
        };

        return (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-1">
              <span className="font-medium">ORD:</span>
              <span className={`font-medium ${getStatusColor(orderStatus)}`}>
                {orderStatus}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">BILL:</span>
              <span className={`font-medium ${getStatusColor(paymentStatus)}`}>
                {paymentStatus}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex justify-between w-full cursor-pointer"
        >
          Created By
          <span>
            <ArrowUpDown />
          </span>
        </Button>
      ),
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
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Download Bill
              </Button>
              <Button variant="outline" size="sm">
                Print Bill
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Create Bill Again
              </Button>
              <Button variant="outline" size="sm">
                Complete Bill
              </Button>
              <Button variant="outline" size="sm" className="text-red-600">
                Canceled
              </Button>
            </div>
          </div>
        );
      },
    },
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
            {new Date(row.original.createdAt).toLocaleDateString()}{" "}
            {new Date(row.original.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "table",
      header: "Table",
      cell: ({ row }) => {
        const table = row.original.table;
        return (
          <div>
            {table?.name && table?.number
              ? `${table.name} - ${table.number}`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "total_price",
      header: "Total Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "BDT",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
  ];

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const totalPages = data?.totalPages || 1;

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
          placeholder="Search by Order UID"
          className="max-w-sm"
          value={searchOrderUid}
          onChange={(e) => setSearchOrderUid(e.target.value)}
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
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={data?.orders || []} />
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                console.log("Previous button clicked");
                setPage((prev) => Math.max(1, prev - 1));
              }}
              // disabled={page === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => {
                  console.log("Page number clicked:", i + 1);
                  setPage(i + 1);
                }}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                console.log("Next button clicked");
                setPage((prev) => Math.min(totalPages, prev + 1));
              }}
              // disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
