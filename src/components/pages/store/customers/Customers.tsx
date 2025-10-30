"use client";

import { useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { useCustomers, Customer } from "@/hooks/useCustomers";
import React from "react";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "uid",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      const formattedDate = new Date(customer.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer.uid}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.original.email;
      return email ? email: "N/A";
    }
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(customer.uid)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Customers = () => {
  const [page, setPage] = useQueryState(
    "s_customer_page",
    parseAsInteger.withDefault(1)
  );
  const [limit, setLimit] = useQueryState(
    "s_customer_limit",
    parseAsInteger.withDefault(8)
  );
  const [search, setSearch] = useQueryState(
    "s_customer_search",
    parseAsString.withDefault("")
  );
  const [sort, setSort] = useQueryState(
    "s_customer_sort",
    parseAsString.withDefault("name")
  );
  const [order, setOrder] = useQueryState(
    "s_customer_order",
    parseAsString.withDefault("asc")
  );

  const { data, isLoading, isError, error } = useCustomers({
    page,
    limit,
    search: search || undefined,
    sort,
    order: order as "asc" | "desc",
  });

  const totalPages = data?.pagination.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setPage(1); // Reset to first page when limit changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  if (isError) {
    toast.error("Failed to fetch customers: " + error?.message);
    return <div className="text-red-500">Error: {error?.message}</div>;
  }

  const paginationItems = [];
  const maxPageNumbers = 5; // Maximum number of page numbers to display

  // Logic to determine which page numbers to display
  let startPage = Math.max(1, page - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(i);
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>Customers</h1>
        <Button className="bg- cursor-pointer bg-blue-600">
          <span>
            <Plus />
          </span>
          Add Customer
        </Button>
      </div>
      <div className="relative mt-5 mb-5 w-[200px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search"
          className="pl-8"
          value={search || ""}
          onChange={handleSearchChange}
        />
      </div>

      <div className="mt-8 px-4">
        {isLoading ? (
          <div>Loading customers...</div>
        ) : (
          <DataTable columns={columns} data={data?.customers || []} />
        )}

        {/* Pagination Section */}
        <div className="flex items-center justify-between mt-8">
          {/* Showing info */}
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, data?.pagination.totalItems || 0)} of{" "}
            {data?.pagination.totalItems || 0} customers
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-4">
            {/* Items per page */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Items per page:</span>
              <Select
                onValueChange={handleLimitChange}
                value={limit.toString()}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="8" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center space-x-2">
              {/* Previous */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {paginationItems.map((item) => (
                  <Button
                    key={item}
                    variant={page === item ? "default" : "outline"}
                    className="h-8 w-8"
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>

              {/* Next */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
