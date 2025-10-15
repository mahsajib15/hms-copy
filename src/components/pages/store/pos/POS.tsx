"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, ShoppingCart, ArrowUpDown, Trash2 } from 'lucide-react';
import Image from 'next/image';

const POS = () => {
  const [activeTab, setActiveTab] = useState('all');

  const menuItems = [
    {
      id: '1',
      name: 'Borhani glass',
      category: 'Juice and Drinks Item',
      price: 40.00,
      image: '/file.svg',
    },
    {
      id: '2',
      name: 'Borhani 500 ml',
      category: 'Juice and Drinks Item',
      price: 100.00,
      image: '/file.svg', 
    },
    {
      id: '3',
      name: 'Borhani 1 ltr',
      category: 'Juice and Drinks Item',
      price: 190.00,
      image: '/file.svg', 
    },
    {
      id: '4',
      name: 'সাদা ভাত',
      category: 'Vat Bhorta Bhaji Item',
      price: 30.00,
      image: '/file.svg', 
    },
    {
      id: '5',
      name: 'মাটন কাচ্চি BASMOTI',
      category: 'Khichuri ebong Biriyani Item',
      price: 300.00,
      image: '/file.svg', 
    },
    {
      id: '6',
      name: 'TEHARI',
      category: 'Khichuri ebong Biriyani Item',
      price: 150.00,
      image: '/file.svg',
    },
    {
      id: '7',
      name: 'Pani choto',
      category: 'Juice and Drinks Item',
      price: 20.00,
      image: '/file.svg', 
    },
    {
      id: '8',
      name: 'কাপ দই',
      category: 'Dessert Item',
      price: 40.00,
      image: '/file.svg',
    },
    {
      id: '9',
      name: 'মাটন লেগ রোস্ট',
      category: 'Mangso Item',
      price: 300.00,
      image: '/file.svg', 
    },
    {
      id: '10',
      name: 'চিকেন জালি কাবাব',
      category: 'Side Dish',
      price: 40.00,
      image: '/file.svg',
    },
  ];

  return (
    <div className="flex h-full p-6">
      <div className="flex-1">
        <ScrollArea className="w-full rounded-md border mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start flex-wrap">
              <TabsTrigger value="all" className="cursor-pointer">All Menus</TabsTrigger>
              <TabsTrigger value="vat_bhorta_bhaji" className="cursor-pointer">Vat Bhorta Bhaji Item</TabsTrigger>
              <TabsTrigger value="mangso" className="cursor-pointer">Mangso Item</TabsTrigger>
              <TabsTrigger value="mach" className="cursor-pointer">Mach Item</TabsTrigger>
              <TabsTrigger value="khichuri_biriyani" className="cursor-pointer">Khichuri ebong Biriyani Item</TabsTrigger>
              <TabsTrigger value="sokaler_nasta" className="cursor-pointer">Sokaler Nasta Menu</TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollArea>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Menus</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search" className="pl-8" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Add New Menu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="flex flex-col cursor-pointer">
              <CardContent className="p-0 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={150}
                  className="w-full h-36 object-cover rounded-t-md"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button variant="secondary" size="icon" className="h-6 w-6 cursor-pointer">
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-6 w-6 cursor-pointer">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                <p className="text-sm text-gray-500">{item.category}</p>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="text-lg font-bold">৳{item.price.toFixed(2)}</span>
                <Button size="icon" className="h-8 w-8 cursor-pointer">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-96 border-l p-4">
        <Card className="h-[calc(100vh-10rem)] flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Current Order</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src="/file.svg" alt="Borhani glass" width={40} height={40} className="rounded-md" />
                    <div>
                      <p className="font-medium">Borhani glass</p>
                      <p className="text-sm text-gray-500">৳40.00 x 1</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-6 w-6 cursor-pointer">-</Button>
                    <span>1</span>
                    <Button variant="outline" size="icon" className="h-6 w-6 cursor-pointer">+</Button>
                    <Button variant="destructive" size="icon" className="h-6 w-6 cursor-pointer">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src="/file.svg" alt="Sada Bhat" width={40} height={40} className="rounded-md" />
                    <div>
                      <p className="font-medium">সাদা ভাত</p>
                      <p className="text-sm text-gray-500">৳30.00 x 2</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-6 w-6 cursor-pointer">-</Button>
                    <span>2</span>
                    <Button variant="outline" size="icon" className="h-6 w-6 cursor-pointer">+</Button>
                    <Button variant="destructive" size="icon" className="h-6 w-6 cursor-pointer">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col p-4 border-t">
            <div className="flex justify-between w-full text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>৳70.00</span>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Order Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default POS;
