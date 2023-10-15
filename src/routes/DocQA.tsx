import React, { useEffect, useRef, useState } from 'react'
import { DragDropFile } from '../components/DragDropFile'
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, IconButton, Input, InputGroup, InputRightElement, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import { AI_ROLE, DOC_UPLOAD_TYPE, USER_ROLE } from '../constant';
import { AiOutlineSend } from 'react-icons/ai';

interface msg {
  role: string
  content: string
}

const default_msg = Object.freeze({
  role: AI_ROLE,
  content: 'Hi, Ask me any question on your uploaded documents!'
})

export const DocQA = () => {
  const [file, setfile] = useState<File[]>([]);
  const [msgList, setmsgList] = useState<msg[]>([default_msg]);
  const [isProcessing, setisProcessing] = useState(false);
  const [isAnswering, setisAnswering] = useState(false);
  const [isUploaded, setisUploaded] = useState(false);
  const fileElRef = useRef<HTMLInputElement>(null)
  const inputElRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // useEffect(() => {
  //   setmsgList(prep=>[...prep,{
  //     role: AI_ROLE,
  //     content: 'Hi, Ask me any question on your uploaded documents!'
  //   }])

  //   return () => {

  //   }
  // }, []);

  const handleUpload = async () => {
    setisProcessing(true)
    setisUploaded(false)
    try {
      if (!file || file.length === 0) {
        throw new Error('No File')
      }
      let url = `/api`
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append('files', file[i]);
      }
      url += '/uploadDoc'

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      if (!response.ok) throw new Error(response.statusText)
      // const jsonRes = await response.json()
      toast({
        title: 'Uploaded Success',
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
      onOpen()
    } catch (err) {
      toast({
        title: 'Error',
        description: `${err}`,
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    } finally {
      setisProcessing(false)
      setisUploaded(true)
    }
  }

  const clearRef = () => {
    setfile([])
    if (fileElRef.current) fileElRef.current!.value = ''
  }


  const handleKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAnswering) return
    if (ev.key === 'Enter') {
      const input = ev.currentTarget.value
      addUserMsg(input)
      sendQuery(input)
    }
  }

  // const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
  // addUserMsg(ev.target.value);
  // }

  const handleClickSendBtn = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnswering) return
    if (inputElRef.current) {
      const input = inputElRef.current.value
      addUserMsg(input);
      sendQuery(input)
    }
  }

  const addUserMsg = (content: string) => {
    setmsgList(prev => [...prev, {
      role: USER_ROLE,
      content: content
    }])
    if (inputElRef.current) inputElRef.current.value = ''
  }

  const sendQuery = async (query: string) => {
    setisAnswering(true)
    try {
      if (!query) {
        throw new Error('No query')
      }
      const url = `/api/docQA`
      const formData = new FormData();
      formData.append('query', query);

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      if (!response.ok) throw new Error(response.statusText)

      const reader = response.body?.getReader()
      if (reader) {
        let result: ReadableStreamReadResult<Uint8Array>
        while (!(result = await reader.read()).done) {
          const lines = new TextDecoder("utf-8").decode(result.value)
          setmsgList(prev => [...prev, {
            role: AI_ROLE,
            content: lines
          }])
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: `${err}`,
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    } finally {
      setisAnswering(false)
    }
  }

  return (
    <section className='flex flex-col gap-8 grow'>
      <div className='text-center space-y-4'>
        <h1 className='font-bold text-5xl'>Document Q&A</h1>
        <h2 className='font-semiboldbold text-2xl'>Upload multiple documents, interact with LLM for Q&A</h2>
      </div>
      <div className='space-y-8 px-8 m-auto'>
        {
          isProcessing
            ? (
              <div className='flex justify-center items-center'>
                <Spinner />
              </div>
            )
            : (<>
              <DragDropFile
                file={file}
                setfile={setfile}
                fileElRef={fileElRef}
                type={DOC_UPLOAD_TYPE} />
              <div className='flex justify-center space-x-4'>
                <button
                  className='bg-[#F3A950] py-2 px-4 font-semibold rounded-md text-[#161B21]'
                  onClick={handleUpload}
                >
                  Upload
                </button>
                <button
                  className='bg-white py-2 px-4 font-semibold rounded-md text-[#161B21]'
                  onClick={clearRef}>Clear</button>
                {/* {isUploaded ?? */}
                  <button
                    className='bg-[#DDC6B6] py-2 px-4 font-semibold rounded-md text-[#161B21]'
                    onClick={onOpen}>Chat</button>
                {/* } */}
              </div>
            </>)
        }

      </div>

      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        closeOnOverlayClick={false}
        size={`md`}
      // finalFocusRef={btnRef}
      >
        {/* <DrawerOverlay /> */}
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chat (Mistral-7B-OpenOrca-GPTQ)</DrawerHeader>

          <DrawerBody className='overflow-y-scroll'>
            {
              msgList.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex text-white  ${msg.role === AI_ROLE ? "" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[400px] 
                  ${msg.role === AI_ROLE ? "bg-[#101820]" : "bg-[#F2AA4C]"}
                  border-2 p-4 whitespace-pre-line
                  rounded-sm`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            }
          </DrawerBody>

          <DrawerFooter>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                placeholder='Ask Question'
                onKeyUp={handleKeyPress}
                ref={inputElRef}
              // onChange={handleChange}
              />
              <InputRightElement width='4.5rem'>
                <IconButton
                  h='1.75rem'
                  size='sm'
                  icon={<AiOutlineSend />}
                  onClick={handleClickSendBtn} aria-label={'send message'} />
              </InputRightElement>
            </InputGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}
