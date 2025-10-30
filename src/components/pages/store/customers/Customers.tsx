import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const Customers = () => {
  return (
    <div>
      <div className='flex justify-between'>
        <h1>Customer</h1>
        <Button className='bg- cursor-pointer bg-blue-600'><span><Plus /></span>Add Customer</Button>
      </div>
    </div>
  )
}

export default Customers
