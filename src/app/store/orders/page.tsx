"use client";

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useOrders, Order } from "@/hooks/useOrders";
import { Input } from "@/components/ui/input";
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

export default function OrderPage() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(8));
  const [searchOrderUid, setSearchOrderUid] = useQueryState('order_uid', parseAsString.withDefault(''));
  const [searchCustomer, setSearchCustomer] = useQueryState('customer', parseAsString.withDefault(''));
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('created_at'));

  const { data, isLoading, isError, error } = useOrders(
    Number(page),
    Number(limit),
    searchOrderUid || '',
    searchCustomer || '',
    sortBy || 'created_at'
  );

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_uid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const orderDate = new Date(row.original.created_at);
        const isValidDate = !isNaN(orderDate.getTime());

        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(row.original.consignment_id);
            toast.success(`Copied: ${row.original.consignment_id}`, {
              duration: 2000,
            });
          } catch {
            toast.error("Failed to copy order ID.");
          }
        };

        return (
          <div className="flex items-center gap-3">
            <Copy
              size={20}
              className="cursor-pointer text-gray-600 hover:text-green-600 transition-colors"
              onClick={handleCopy}
              aria-label="Copy Order ID"
            />
            <div className="flex flex-col">
              <div className="font-medium">{row.original.consignment_id}</div>
              <div className="text-sm text-gray-500">
                {isValidDate
                  ? `${orderDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })} ${orderDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}`
                  : "Invalid Date"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.customer;
        return (
          <div className="flex flex-col">
            <div className="font-medium">
              {customer?.name ||
                row.original.customerName ||
                "Walk-in Customer"}
            </div>
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
      accessorKey: "returnedQuantity",
      header: "Returned",
      cell: ({ row }) => (
        <div className="text-center">{row.original.returnedQuantity || 0}</div>
      ),
    },
    {
      accessorKey: "billing",
      header: "Billing",
      cell: ({ row }) => {
        const receivedAmount =
          row.original.billingDetails?.received || row.original.received || 0;
        return (
          <div className="font-medium text-green-500">
            ৳{receivedAmount.toFixed(2)} - Received
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const orderStatus = row.original.status;
        const getStatusColor = (status: string) => {
          switch (status) {
            case "PENDING":
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
          <div className="flex items-center space-x-1">
            <span className={`font-medium ${getStatusColor(orderStatus)}`}>
              {orderStatus}
            </span>
          </div>
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
        return (
          <div className="flex items-center space-x-2">
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
                  onClick={() => {
                    navigator.clipboard.writeText(order.consignment_id);
                    toast.success(
                      `Order ID ${order.consignment_id} copied successfully.`
                    );
                  }}
                >
                  Copy Order ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Customer</DropdownMenuItem>
                <DropdownMenuItem>View Order Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
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

      <div className="flex justify-between items-center space-x-2 mb-4">
        <Input
          placeholder="Search by Order UID"
          className="max-w-sm"
          value={searchOrderUid}
          onChange={async (e) => {
            await setSearchOrderUid(e.target.value);
            await setPage(1);
          }}
        />
        <Input
          placeholder="Search Customer"
          className="max-w-sm"
          value={searchCustomer}
          onChange={async (e) => {
            await setSearchCustomer(e.target.value);
            await setPage(1);
          }}
        />
        <Select 
          onValueChange={async (value) => {
            await setSortBy(value);
            await setPage(1);
          }} 
          value={sortBy}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Order Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={data?.orders || []} />

      <div className="flex items-center justify-between mt-8 px-4">
        <div className="text-sm text-gray-500">
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.total || 0)} of {data?.total || 0} orders
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Items per page:</span>
            <Select
              onValueChange={async (value) => {
                await setLimit(Number(value));
                await setPage(1);
              }}
              value={limit.toString()}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="32">32</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const newPage = Math.max(1, Number(page) - 1);
                await setPage(newPage);
              }}
              disabled={Number(page) === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1">
              {(() => {
                const getPaginationItems = (currentPage: number, totalPages: number) => {
                  const delta = 2;
                  const range = [];
                  const rangeWithDots = [];
                  let lastItem: number | string | undefined;

                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                      range.push(i);
                    }
                  }

                  for (let i of range) {
                    if (lastItem) {
                      if (typeof lastItem === 'number' && i - lastItem === 2) {
                        rangeWithDots.push(lastItem + 1);
                      } else if (typeof lastItem === 'number' && i - lastItem !== 1) {
                        rangeWithDots.push("...");
                      }
                    }
                    rangeWithDots.push(i);
                    lastItem = i;
                  }
                  return rangeWithDots;
                };

                return getPaginationItems(Number(page), totalPages).map((item, index) => {
                  if (item === "...") {
                    return <span key={`ellipsis-${index}`}>...</span>;
                  }
                  const pageNum = item as number;
                  return (
                    <Button
                      key={pageNum}
                      variant={Number(page) === pageNum ? "default" : "outline"}
                      className="h-8 w-8"
                      onClick={async () => await setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                });
              })()}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const newPage = Math.min(totalPages, Number(page) + 1);
                await setPage(newPage);
              }}
              disabled={Number(page) === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
