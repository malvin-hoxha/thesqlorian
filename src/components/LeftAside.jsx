import React, { useEffect, useState } from 'react'
import initSqlJs from 'sql.js';
import padawans from '../data/table';
import data from '../data/data';
const LeftAside = ({tableIndex, tasks, ChangePage, onCompleteLastTask, gameResetTrigger}) => {

    const [userSQLMap, setUserSQLMap] = useState({});
    const [isCorrect, setIsCorrect] = useState(null);
    
    const [db, setDb] = useState(null);
    const [userSQL, setUserSQL] = useState("");
    const [userResult, setUserResult] = useState([]); 
    const [queryError, setQueryError] = useState("");

    useEffect(() => {
        setUserSQL(userSQLMap[tableIndex] || "");
        setQueryError("");
        setUserResult([]);
        setIsCorrect(null);
    }, [tableIndex, userSQLMap]);

    useEffect(() => {
        setUserSQLMap({});
        setUserSQL("");
        setIsCorrect(null);
        setUserResult([]);
        setQueryError("");
    }, [gameResetTrigger]);

    useEffect(() => {
        (async () => {
          const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
          const dbInstance = new SQL.Database();
          
    
          dbInstance.run(`
            CREATE TABLE padawans (
              id INTEGER,
              name TEXT,
              species TEXT,
              age INTEGER,
              lightsaber_color TEXT
            );
          `);
    
          padawans.forEach(p => {
            dbInstance.run(
              `INSERT INTO padawans (id, name, species, age, lightsaber_color) VALUES (?, ?, ?, ?, ?)`,
              [p.id, p.name, p.species, p.age, p.lightsaber_color]
            );
          });
    
          setDb(dbInstance);
        })();
      }, []);
    
      const handleRunSQL = () => {
        try {
            const result = db.exec(userSQL);
    
            if (result.length > 0) {
                const { columns, values } = result[0];
                const formatted = values.map(row =>
                    Object.fromEntries(row.map((val, i) => [columns[i], val]))
                );
                setUserResult(formatted);
                setQueryError("");
    
                const expected = db.exec(tasks.expected_sql);
                let expectedFormatted = [];
    
                if (expected.length > 0) {
                    const { columns: expCols, values: expVals } = expected[0];
                    expectedFormatted = expVals.map(row =>
                        Object.fromEntries(row.map((val, i) => [expCols[i], val]))
                    );
                }
    
                const isSameResult = JSON.stringify(formatted) === JSON.stringify(expectedFormatted);
                setIsCorrect(isSameResult);
                if (isSameResult && tableIndex === data.length - 1) {
                    setTimeout(() => {
                        onCompleteLastTask();
                    }, 1500);
                }
            } else {
                setUserResult([]);
                setQueryError("No rows returned.");
                setIsCorrect(false);
            }
        } catch (err) {
            setUserResult([]);
            setQueryError("Invalid SQL query.");
            setIsCorrect(false);
        }
    };
    

    return (
        <>
            <h2 className="text-2xl font-semibold text-amber-400">Command Console</h2>
            <textarea
                value={userSQL}
                onChange={(e) => {
                    const val = e.target.value;
                    setUserSQL(val);
                    setUserSQLMap(prev => ({ ...prev, [tableIndex]: val }));
            }}
                className="w-full h-40 p-4 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:outline-none 
                    focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your SQL command..."
            />
            
            <div className='flex items-center sm:gap-4 gap-2'>
                <button
                    onClick={handleRunSQL}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 transition-all text-black font-bold rounded-xl shadow cursor-pointer">
                    Run Query
                </button>

                <button
                    disabled={!isCorrect}
                    onClick={() => ChangePage('next')}
                    className={`px-5 py-2  text-white font-semibold rounded-xl shadow-lg 
                        transition-all duration-200  
                        ${!isCorrect ? 'bg-red-900 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'} `}
                >
                    Next
                </button>

                <button
                    onClick={() => ChangePage('previous')}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-lg
                        hover:bg-blue-700 transition-all duration-200 cursor-pointer"
                >
                    Previous
                </button>
            </div>
            

            <div className="my-5">
                <pre className="p-4 text-amber-200 text-start text-base bg-zinc-800 rounded-lg border border-zinc-600 whitespace-pre-wrap">
                    {tasks.example_sql}
                </pre>
            </div>


            <div>
                {isCorrect !== null && (
                    <h1 className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} transition-all duration-300`}>
                        {isCorrect ? 'CORRECT' : 'WRONG'}
                    </h1>
                )}
            </div>

            {queryError && <p className="text-red-400 italic">{queryError}</p>}
            
            {userResult.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-amber-400 mb-2">Your Query Result</h2>

                    {userResult[0].error ? (
                    <p className="text-red-400 italic">{userResult[0].error}</p>
                    ) : (
                        <table className="w-full table-auto border-collapse text-sm">
                            <thead className="bg-zinc-700 text-amber-300">
                                <tr>
                                    {Object.keys(userResult[0]).map((key) => (
                                    <th key={key} className="border sm:py-2 border-zinc-600 sm:px-3">
                                        {key}
                                    </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                            {userResult.map((row, index) => (
                                <tr key={index} className="hover:bg-zinc-700 transition-colors">
                                {Object.values(row).map((value, i) => (
                                    <td key={i} className="border border-zinc-600 sm:px-3 sm:py-2 text-center">
                                    {value}
                                    </td>
                                ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </>
    )
}

export default LeftAside