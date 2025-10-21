import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Plus } from "lucide-react";

interface AddMenuItemFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMenuItemForm: React.FC<AddMenuItemFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [price, setPrice] = useState("");
  const [keywords, setKeywords] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [status, setStatus] = useState("available");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      menuType,
      price,
      keywords,
      kitchen,
      status,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Menu</DialogTitle>
          <DialogDescription>Fill in the details to add a new menu item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="menuType" className="text-right">
              Menu Type
            </Label>
            <Select onValueChange={setMenuType} value={menuType} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select menu type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Course</SelectItem>
                <SelectItem value="appetizer">Appetizer</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
                <SelectItem value="drink">Drink</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Menu Image (optional)
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4" /> Upload
              </Button>
              <span className="text-sm text-gray-500">Max 4MB</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right">
              Keywords (optional)
            </Label>
            <Textarea
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="col-span-3"
              placeholder="Enter comma-separated keywords"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kitchen" className="text-right">
              Kitchen (optional)
            </Label>
            <Select onValueChange={setKitchen} value={kitchen}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Kitchen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main_kitchen">Main Kitchen</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="dessert_station">Dessert Station</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status (optional)
            </Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Menu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuItemForm;