import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'

const uiText = [
    {
        h1: "Video Transcription",
        h2: "Transform long video into text",
        steps: [
            "Upload Video/Youtube Link",
            "Get Transcript",
        ]
    },
    {
        h1: "Document Q&A",
        h2: "Upload multiple documents, ask LLM (Large Language Model) for any question on the documents",
        steps: [
            "Upload multiple documents",
            "Chat with AI",
        ]
    },
]

export const Subsection = () => {
    return (
        <>
            {
                uiText.map((ui, idx) => (
                    <div key={idx} className=' p-3 max-w-5xl m-auto '>
                        <div className='text-center pb-8 space-y-4'>
                            <h1 className='text-[#ed6f63] text-4xl font-semibold'>{ui.h1}</h1>
                            <h2 className='text-2xl text-[#cdd2d8]'>{ui.h2}</h2>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 m-auto'>
                            {
                                ui.steps.map((step, idx) => (
                                    <Card maxW='300px' w={'300px'} backgroundColor={`#F2AA4C`} key={idx} className='pt-8 pb-14 m-auto '>
                                        <CardBody className='bg-[#F2AA4C] space-y-4'>
                                            <div className='round-lg bg-[#101820] text-white p-2 rounded-[999px] w-14 h-14 flex items-center justify-center'>
                                                {idx+1}
                                            </div>
                                            <div>
                                                <h3 className=' text-[#101820] text-xl font-medium'>{step}</h3>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))
            }
        </>

    )
}
