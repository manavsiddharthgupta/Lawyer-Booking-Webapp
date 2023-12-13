import { DataTable } from './components/data-table'
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <div className=''>
        <div className='flex h-full flex-1 flex-col space-y-8 p-8 md:flex'>
          <div className='flex items-center justify-start space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Welcome back!
              </h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of lawyers that are available for you!
              </p>
            </div>
          </div>
          <DataTable />
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App
