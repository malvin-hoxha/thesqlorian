import React from 'react'

const Credits = ({onClick}) => {
  return (
    <div className="fixed bg-black/50 backdrop-blur-sm inset-0 z-51">
        <div className="inset-0 min-h-lvh flex items-center justify-center z-49">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-8 rounded-3xl shadow-2xl max-w-xl w-full border border-zinc-700">
            <h2 className="text-3xl font-extrabold text-amber-400 tracking-wide mb-4">Credits</h2>

            <ul className="list-disc list-inside space-y-2 text-lg text-zinc-200">
                <li>ΜΑΜΙΔΑΚΗΣ ΓΕΩΡΓΙΟΣ</li>
                <li>ΜΑΛΒΙΝ ΧΟΤΖΑ</li>
                <li>ΚΙΡΚΑΛΑΣ ΠΑΝΑΓΙΩΤΗΣ</li>
                <li>ΠΑΣΧΑΛΙΔΗΣ ΑΝΤΩΝΙΟΣ</li>
                <li>ΠΙΓΓΙΟΣ ΠΑΝΑΓΙΩΤΗΣ</li>
                <li>
                    <span className="text-amber-300">Music</span> by Luis Humanoide from Pixabay
                </li>
                <li>
                    <span className="text-amber-300">Icons</span> (Play, Pause, Yoda, Vader) by Icons8
                </li>
            </ul>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClick}
                    className="bg-amber-500 text-black px-6 py-2 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-md cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Credits