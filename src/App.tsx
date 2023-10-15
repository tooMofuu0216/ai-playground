
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import { AiFillGithub } from "react-icons/ai";

function App() {

  return (
    <ChakraProvider>
      <>
        <div className='min-h-screen flex flex-col  bg-[#101820] text-white gap-8'>
          <Navbar />
          <Outlet />
          <div className="flex justify-center text-sm my-4 ">
            <p>Created by <a className="text-[#ed6f63]" href="https://github.com/tooMofuu0216">Martin</a></p>
          </div>
        </div>
      </>
    </ChakraProvider>
  )
}

export default App
