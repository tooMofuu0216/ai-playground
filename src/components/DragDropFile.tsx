import { Card, CardBody, Icon } from '@chakra-ui/react';
import { AiFillFileText, AiOutlineUpload } from 'react-icons/ai';
import { DOC_UPLOAD_TYPE } from '../constant';

interface DragDropFileProp {
    file: File[]
    setfile: React.Dispatch<React.SetStateAction<File[]>>
    fileElRef: React.RefObject<HTMLInputElement>
    type: string
}

export const DragDropFile = ({ file, setfile, fileElRef, type }: DragDropFileProp) => {

    const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => { ev.preventDefault() }
    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        if (fileElRef.current && ev.dataTransfer.files)
            setfile(Array.from(ev.dataTransfer.files))
    }

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files)
            setfile(Array.from(ev.target.files))
        console.log(file)
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileElRef.current?.click()}
            className='cursor-pointer border-dashed border-2 p-4 flex flex-col text-center gap-4 text-[#ed6f63] border-[#ed6f63]'
        >
            {file?.length > 0
                ? (<Card>
                    <CardBody>
                        <Icon as={AiFillFileText} />
                        {
                            file.map((f, idx) => (
                                <div key={idx}>{f.name}</div>
                            ))}
                    </CardBody>
                </Card>)
                : (
                    <>
                        <div className='flex justify-center text-8xl'>
                            <AiOutlineUpload />
                        </div>
                        <h4 className='font-semibold text-lg'>Drag and Drop File</h4>
                        <h5 className='font-medium text-sm'>
                            Supported Types:
                            ({
                                type === DOC_UPLOAD_TYPE
                                    ? ".pdf, .txt"
                                    : ".mp4"
                            })
                        </h5>
                        {/* <h4 className='font-semibold text-lg'>Or</h4> */}
                        <input
                            type="file"
                            multiple={type === DOC_UPLOAD_TYPE}
                            name=""
                            id=""
                            hidden
                            onChange={handleFileChange}
                            ref={fileElRef}
                        />
                        {/* <button 
                            className='bg-[#F3A950] p-2 ' onClick={() => fileElRef.current?.click()}>Browse</button> */}
                    </>
                )
            }
        </div>

    )
}
