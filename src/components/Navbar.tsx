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
            <li onClick={onClose}
                className='hover:text-[#ed6f63] cursor-point'>
                <Link to="/">Home</Link></li>
            <li onClick={onClose}

                className='hover:text-[#ed6f63] cursor-pointer '>
                <Link to="/video">Video Transcription</Link></li>
            <li onClick={onClose}

                className='hover:text-[#ed6f63] cursor-pointer '>
                <Link to="/docQA">Document Q&A</Link></li>
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