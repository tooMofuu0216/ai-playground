import { DragDropFile } from '../components/DragDropFile'
import { Icon, Input, InputGroup, InputLeftElement, Spinner, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai'
import { DL_TXT_NAME, VIDEO_UPLOAD_TYPE } from '../constant';

export const Video = () => {

  const [file, setfile] = useState<File[]>([]);
  const [youtubeLink, setyoutubeLink] = useState('');
  const [isProcessing, setisProcessing] = useState(false);
  const [transcriptionText, settranscriptionText] = useState<string[]>([]);
  const fileElRef = useRef<HTMLInputElement>(null)
  const linkInputElRef = useRef<HTMLInputElement>(null)
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)
  const toast = useToast()


  const handleUpload = async () => {
    setisProcessing(true)
    settranscriptionText([])
    try {
      if (file.length === 0 && !youtubeLink) {
        throw new Error('No video Data')
      }

      let url = `/api`
      const formData = new FormData();

      if (file.length > 0) {
        formData.append('file', file[0]);
        url += '/uploadVideo'
      } else if (youtubeLink) {
        formData.append('youtube_link', youtubeLink);
        url += '/download_youtube_video'
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      if (!response.ok) throw new Error(response.statusText)
      const reader = response.body?.getReader()
      if (reader) {
        let result: ReadableStreamReadResult<Uint8Array>
        while (!(result = await reader.read()).done) {
          const data = new TextDecoder("utf-8").decode(result.value)
          const lines = data.split('\n')
          settranscriptionText((prevData) => [...prevData, ...lines]);
        }
      }
    } catch (err) {
      console.error('error:', err)
      showToast(`${err}`)
    } finally {
      setisProcessing(false)
    }
  }

  const handleTabsChanged = (idx: number) => {
    if (idx === 0) {
      setyoutubeLink('')
      if (linkInputElRef.current) linkInputElRef.current.value = ''
    } else {
      setfile([])
      if (fileElRef.current) fileElRef.current!.value = ''
    }
  }

  const showToast = (errorMsg: string) => {
    toast({
      title: 'Error',
      description: errorMsg,
      status: 'error',
      position: 'top',
      duration: 2000,
      isClosable: true,
    })
  }

  const clearRef = () => {
    setyoutubeLink('')
    if (linkInputElRef.current) linkInputElRef.current.value = ''
    setfile([])
    if (fileElRef.current) fileElRef.current!.value = ''
  }

  const handleDl = async () => {
    const url = `/api/downloadTranscript`
    try {
      if (transcriptionText.length === 0) throw new Error(`No Transcription`);
      const response = await fetch(url, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      // Create a blob from the response
      return response.blob().then((blob) => {
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = DL_TXT_NAME;
          downloadLinkRef.current.click();
        }
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error(err)
      showToast(`${err}`)
    }
  }

  return (
    <section className='flex flex-col gap-8 grow'>
      <div className='text-center space-y-4'>
        <h1 className='font-bold text-5xl'>Upload File</h1>
        <h2 className='font-semiboldbold text-2xl'>Get Transcript, download</h2>
      </div>

      <div className='space-y-8 flex flex-col justify-center px-4 '>
        {/* upload */}
        <div className='m-auto bg-[#161B21] p-8 rounded-lg max-w-[500px]'>
          {
            isProcessing ? (
              <div className='flex justify-center items-center'>
                <Spinner />
              </div>
            )
              : (<>
                <Tabs variant='enclosed'
                 onChange={handleTabsChanged} 
                      fontWeight={`semibold`} >
                  <TabList
                    color={`white`}
                  >
                    <Tab
                      // backgroundColor={`#ed6f63`}
                      >
                      File Upload
                    </Tab>
                    <Tab
                      // backgroundColor={`#ed6f63`}
                    >
                      Youtube Link
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <DragDropFile file={file} setfile={setfile} fileElRef={fileElRef} type={VIDEO_UPLOAD_TYPE} />
                    </TabPanel>
                    <TabPanel>
                      <Stack spacing={3}>
                        <InputGroup>
                          <InputLeftElement pointerEvents='none'>
                            <Icon as={AiOutlineLink} />
                          </InputLeftElement>
                          <Input
                            type='text'
                            placeholder={`e.g. https://www.youtube.com/watch?v=abc`}
                            onChange={(ev) => setyoutubeLink(ev.target.value)}
                            ref={linkInputElRef}
                          />
                        </InputGroup>
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>


                <div className='mt-8 flex justify-center gap-8'>
                  <button
                    className='bg-[#F3A950] py-2 px-4 font-semibold rounded-md text-[#161B21]' onClick={handleUpload}>Submit</button>
                  <button
                    className='bg-white py-2 px-4 font-semibold rounded-md text-[#161B21]'
                    onClick={clearRef}>Clear</button>
                </div>
              </>)}
        </div>

        {/* result */}
        <div className='space-y-4 mx-12 '>
          <div className='flex sm:flex-row flex-col justify-between gap-4'>
            <div>
              <h3 className='font-semibold text-2xl'>Transcription:</h3>
            </div>
            <div className='flex flex-col gap-2'>
              <button className='bg-[#F3A950] py-2 px-4 font-semibold rounded-md text-[#161B21]'
                onClick={handleDl}
              >Download as txt</button>
              <a className='hidden' ref={downloadLinkRef}></a>
              {/* <button className='py-2 px-4 font-semibold rounded-md bg-[#DDC6B6] text-[#161B21]'
                onClick={handleDl}
              >Chat and get summary</button> */}
            </div>
          </div>
          <div className='h-[450px] bg-[#161B21] text-white overflow-y-scroll'>
            {
              transcriptionText &&
              transcriptionText.map((text, idx) => (
                <div key={idx} className='p-2 hover:bg-[#F3A950]  '>
                  {text}
                </div>
              ))
            }
          </div>
        </div>


      </div>
    </section>
  )
}
