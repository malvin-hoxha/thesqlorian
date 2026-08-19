import React, { useEffect, useState } from 'react'
import initSqlJs from 'sql.js';

import data from '../data/data';
import { validateSqlStatement } from "../lib/sql/validateSqlStatement.js";
import { evaluateQuery } from "../lib/sql/evaluateQuery.js";
import validationDatasets from "../data/validationDatasets.js";


const LeftAside = ({tableIndex, tasks, ChangePage, onCompleteLastTask, gameResetTrigger, 
    isChallengeCompleted, onChallengeCompleted}) => {

    const [userSQLMap, setUserSQLMap] = useState({});
    const [isCorrect, setIsCorrect] = useState(null);

    const [sqlModule, setSqlModule] = useState(null);
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
        async function initializeSqlModule() {
            const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
            setSqlModule(SQL);
        }
        initializeSqlModule();
    },[]);

      const handleRunSQL = () => {
        try {
            const statementValidation = validateSqlStatement(userSQL);

            if(!statementValidation.valid) {
                setQueryError(statementValidation.error);
                setUserResult([]);
                setIsCorrect(false);
                return;
            }

            if (!sqlModule) {
                setQueryError("SQL engine is still loading.");
                setUserResult([]);
                setIsCorrect(false);
                return;
            }

            const evaluation = evaluateQuery({
                SQL: sqlModule,
                userSql: userSQL,
                expectedSql: tasks.expected_sql,
                hiddenDatasets: validationDatasets,
                orderSensitive: tasks.orderSensitive ?? false,
                columnNamesSensitive: false
            });

            if (evaluation.actualRows.length === 0) {
                setUserResult([]);
                setQueryError("No rows returned");
                setIsCorrect(false);
                return;
            }

            setUserResult(evaluation.actualRows);
            setQueryError("");
            setIsCorrect(evaluation.correct);

            if (evaluation.correct) {
                onChallengeCompleted(tableIndex);

                if (tableIndex === data.length - 1) {
                    setTimeout(() => {
                        onCompleteLastTask();
                    }, 1500);
                }
            }
        } catch {
            setUserResult([]);
            setQueryError("Invalid SQL query.");
            setIsCorrect(false);
        }
    };

    const canGoNext = isCorrect === true || isChallengeCompleted;


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
                    disabled={!canGoNext}
                    onClick={() => ChangePage("next")}
                    className={`px-5 py-2  text-white font-semibold rounded-xl shadow-lg
                        transition-all duration-200
                        ${!canGoNext ? 'bg-red-900 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'} `}
                >
                    Next
                </button>

                <button
                    onClick={() => ChangePage("previous")}
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
