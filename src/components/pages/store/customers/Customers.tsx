import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import React from "react";

const Customers = () => {
  return (
    <div>
      <div className="flex justify-between">
        <h1>Customer</h1>
        <Button className="bg- cursor-pointer bg-blue-600">
          <span>
            <Plus />
          </span>
          Add Customer
        </Button>
      </div>
      <div className="relative mt-5 mb-5 w-[200px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input placeholder="Search" className="pl-8" />
      </div>

      <div className="mt-8 px-4">
        {/* Data Table Placeholder */}
        <div className="border rounded-lg p-6 text-center text-gray-500 bg-white shadow-sm">
          <p>Data Table Placeholder</p>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between mt-8">
          {/* Showing info */}
          <div className="text-sm text-gray-500">
            Showing 1 to 8 of 100 orders
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-4">
            {/* Items per page */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Items per page:</span>
              <Select>
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
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                <Button variant="default" className="h-8 w-8">
                  1
                </Button>
                <Button variant="outline" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" className="h-8 w-8">
                  3
                </Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" className="h-8 w-8">
                  10
                </Button>
              </div>

              {/* Next */}
              <Button variant="outline" size="icon" className="h-8 w-8">
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
