import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-center text-center px-4">
            <div className="space-y-4">
                <h1 className="text-[#ed6f63] font-bold text-6xl">Productive AI Tools</h1>
                <h2 className="max-w-[600px] m-auto">
                    Use State-of-the-art LLM and Machine Learning Models for video transcription and document question and answer.
                 </h2>
                <button className="bg-[#ed6f63] px-4 py-2 rounded-md text-[#101820] font-semibold">
                <Link to="/docQA">
                    Get Start
                </Link>
                </button>
            </div>
            <div>
                <img
                    src="https://149695847.v2.pressablecdn.com/wp-content/uploads/2018/06/7477199676-bigstock-artificial-intelligence-supersize.jpg"
                    alt="" />
            </div>
        </div>
    )
}

export default Hero