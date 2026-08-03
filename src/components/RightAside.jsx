import yoda from '/yoda.svg';

const RightAside = ({tableIndex, tasks, table}) => {
  return (
    <div className="space-y-4">
        <div className="flex items-center space-x-3 mt-4 justify-center">
            <img src={yoda} alt="yoda" className="w-10" />
            <div>
                <h1 className="text-center text-2xl">QUEST {tableIndex + 1}</h1>
                <p className="text-amber-200 italic text-xl text-center">{`"${tasks.hint}"`}</p>
            </div>
            
            </div>

            <div>
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">Expected Result</h2>
            {tasks.resulted_table.length > 0 ? (
                <table className="w-full table-auto border-collapse text-sm">
                <thead className="bg-zinc-700 text-amber-300">
                    <tr>
                    {Object.keys(tasks.resulted_table[0]).map((key) => (
                        <th key={key} className="border border-zinc-600 sm:px-3 py-2">
                        {key}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {tasks.resulted_table.map((row, index) => (
                    <tr key={index} className="hover:bg-zinc-700 transition-colors">
                        {Object.values(row).map((value, i) => (
                        <td key={i} className="border border-zinc-600 sm:px-3 py-2 text-center">
                            {value}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p className="text-amber-200 italic">No results to display.</p>
            )}
            </div>
            
            <div>
                <h2 className="text-2xl font-semibold text-amber-400 mb-4">padawans table</h2>
                <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-zinc-700 text-amber-300">
                        <tr>
                            {Object.keys(table[0]).map((key) => (
                            <th key={key} className="border border-zinc-600 sm:px-3 py-2">
                                {key}
                            </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((row, index) => (
                            <tr key={index} className="hover:bg-zinc-700 transition-colors">
                            {Object.values(row).map((value, i) => (
                                <td key={i} className="border border-zinc-600 sm:px-3 py-2 text-center">
                                    {value}
                                </td>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    </div>
  )
}

export default RightAside