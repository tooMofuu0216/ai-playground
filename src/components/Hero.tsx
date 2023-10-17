import { Tooltip } from "@chakra-ui/react"
import { AiOutlineGithub, AiOutlineRobot } from "react-icons/ai"
import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-center text-center px-4">
            <div className="space-y-6">
                <h1 className="text-[#ed6f63] font-bold text-6xl">Productive AI Tools</h1>
                <h2 className="max-w-[600px] m-auto font-semibold">
                    Use State-of-the-art LLM and Machine Learning Models for video transcription and document question and answer.
                </h2>
                <h2 className="max-w-[600px] m-auto font-semibold">
                    Try Out the Machine Learning Model powered application
                </h2>
                <div className="space-x-4">
                    <button className="bg-[#ed6f63] px-4 py-2 rounded-md text-[#101820] ">
                        <Link to="/docQA">
                            Try Q&A
                        </Link>
                    </button>
                    <button className="border-[#ed6f63] border px-4 py-2 rounded-md text-[#ed6f63] ">
                        <Link to="/video">
                            Try Transcription
                        </Link>
                    </button>
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-slate-300">Powered by</p>
                    <div className="flex justify-center gap-3">
                        <div className="text-lg cursor-pointer">
                        <Tooltip label='Mistral-7B-OpenOrca-GPTQ' fontSize='md'>
                            <a href="https://huggingface.co/TheBloke/Mistral-7B-OpenOrca-GPTQ" target="_blank">
                                <AiOutlineRobot />
                            </a>
                        </Tooltip>
                        </div>
                        <div className="text-lg cursor-pointer">
                        <Tooltip label='faster-whisper' fontSize='md'>
                        <a href="https://github.com/guillaumekln/faster-whisper" target="_blank">

                            <AiOutlineGithub />
                        </a>
                        </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
                <img
                    src="https://149695847.v2.pressablecdn.com/wp-content/uploads/2018/06/7477199676-bigstock-artificial-intelligence-supersize.jpg"
                    alt="" />
            </div> */}
        </div>
    )
}

export default Hero