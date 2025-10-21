import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/apiClient"; // Assuming you have an apiClient for API calls

interface TableData {
  id: number;
  name: string;
  table_number: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface SelectTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: (table: TableData) => void;
}

const SelectTableModal: React.FC<SelectTableModalProps> = ({
  isOpen,
  onClose,
  onSelectTable,
}) => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of items per page

  useEffect(() => {
    if (!isOpen) return;

    const fetchTables = async () => {
      setLoading(true);
      setError(null);
      try {
        // The API endpoint provided in the prompt is:
        // `https://pos-api-dev.mohajon.app/api/v1/restaurant/tables?page=1&limit=200&search=`
        // I'm assuming `apiClient` can handle the base URL and authentication.
        const response = await apiClient.get(
          `/restaurant/tables?page=${currentPage}&limit=${limit}&search=${searchQuery}`
        );
        setTables(response.data.restaurantTables);
        setTotalPages(Math.ceil(response.data.pagination.totalItems / limit));
      } catch (err) {
        console.error("Failed to fetch tables:", err);
        setError("Failed to load tables. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [isOpen, currentPage, searchQuery]);

  const handleSelect = (table: TableData) => {
    onSelectTable(table);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Product</DialogTitle>
          <DialogDescription>
            Select a table for the current order.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading tables...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Table Number</TableHead>
                  <TableHead>Table Description</TableHead>
                  <TableHead>Table Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 cursor-pointer"
                        onClick={() => handleSelect(table)}
                      >
                        Select
                      </Button>
                      <span className="font-medium">{table.name}</span>
                    </TableCell>
                    <TableCell>{table.table_number}</TableCell>
                    <TableCell>{table.description || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={table.status === "ACTIVE" ? "default" : "destructive"}
                      >
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="cursor-pointer">
                        ...
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTableModal;