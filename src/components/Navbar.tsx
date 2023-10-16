import { AiOutlineMenu } from 'react-icons/ai';
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    DrawerHeader,
} from '@chakra-ui/react'
import { Link } from "react-router-dom";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const menuItems = (
        <>
            <Link to="/" onClick={onClose}>
                <li
                    onClick={onClose}
                    className='hover:text-[#ed6f63] cursor-point'>
                    Home
                </li>
            </Link>
            <Link to="/video" onClick={onClose}>
                <li
                    className='hover:text-[#ed6f63] cursor-pointer '>
                    Video Transcription
                </li>
            </Link>
            <Link
                to="/docQA" onClick={onClose}>
            <li
                className='hover:text-[#ed6f63] cursor-pointer '>
                Document Q&A
            </li>
        </Link>
        </>
    )

return (
    <div className="flex justify-between items-center p-4 bg-[#101820]">
        <div>

        </div>
        <ul className="sm:flex hidden flex-row space-y-2 sm:space-y-0 space-x-4 px-8 font-semibold">
            {menuItems}
        </ul>
        <div className='sm:hidden'>
            <button className='text-xl' onClick={onOpen}><AiOutlineMenu /></button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}

            // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    backgroundColor={`#101820`}
                    color={`white`}
                >
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        AI Playground
                    </DrawerHeader>
                    <DrawerBody>
                        <ul className="flex flex-col space-y-2 sm:space-y-0 ">
                            {menuItems}
                        </ul>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    </div >
)
}

export default Navbar