import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";

const HARDCODED_TASK_IDS = [
  "007bbfb7", "00d62c1b", "017c7c7b", "025d127b", "045e512c", "0520fde7", "05269061", "05f2a901", "06df4c85", "08ed6ac7", "09629e4f", "0962bcdd", "0a938d79", "0b148d64", "0ca9ddb6", "0d3d703e",
  // ... 생략 없이 400개 모두 포함
  "ff805c23"
];

const CSV_FILES = [
  "/ARCTraj_with_scores_01.csv",
  "/ARCTraj_with_scores_02.csv",
  "/ARCTraj_with_scores_03.csv"
];

const colorMap = {
  0: "bg-black",
  1: "bg-blue-500",
  2: "bg-red-500",
  3: "bg-green-500",
  4: "bg-yellow-400",
  5: "bg-gray-400",
  6: "bg-pink-500",
  7: "bg-orange-500",
  8: "bg-sky-300",
  9: "bg-rose-800"
};

export default function ArcTrajViewer() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    Promise.all(CSV_FILES.map(path => fetch(path).then(res => res.text())))
      .then(fileTexts => {
        const allRows = [];

        for (const text of fileTexts) {
          const parsed = Papa.parse(text, { header: true });
          allRows.push(...parsed.data.filter(r => r.logId && r.taskId && r.actionSequence));
        }

        const grouped = {};
        for (const row of allRows) {
          const rawTaskId = row.taskId?.trim();
          if (!HARDCODED_TASK_IDS.includes(rawTaskId)) continue;

          const { logId, score, actionSequence } = row;
          let trajectory;
          try {
            trajectory = JSON.parse(actionSequence).map((entry, idx) => ({
              time: idx,
              grid: entry.grid,
              objects: entry.object || [],
              action: `${entry.operation} (${entry.position?.x ?? ""},${entry.position?.y ?? ""})`
            }));
          } catch {
            continue;
          }

          if (!grouped[rawTaskId]) grouped[rawTaskId] = [];
          grouped[rawTaskId].push({
            logId: Number(logId),
            score: Number(score),
            trajectory
          });
        }

        const taskList = HARDCODED_TASK_IDS.map(taskId => {
          const logs = grouped[taskId] || [];
          logs.sort((a, b) => b.score - a.score);
          return { id: taskId, logs };
        });

        setTasks(taskList);
      });
  }, []);

  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const selectedLog = selectedTask?.logs.find(log => log.logId === selectedLogId);
  const trajectory = useMemo(() => selectedLog?.trajectory || [], [selectedLog]);
  const currentState = trajectory[step];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!trajectory.length) return;
      if (e.key === "ArrowRight") {
        setStep(prev => Math.min(prev + 1, trajectory.length - 1));
      } else if (e.key === "ArrowLeft") {
        setStep(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trajectory]);

  return (
    <div className="flex flex-col min-h-screen w-screen font-sans">
      {/* 상단 헤더 */}
      <div className="bg-white text-center py-6 shadow-md">
        <h1 className="text-4xl font-black text-black mb-2">ARCTraj</h1>
        <p className="text-xl text-gray-700 mb-4">
          Human Reasoning Trajectories Collected From Interactive Sessions On The Abstraction and Reasoning Corpus
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://huggingface.co/datasets/SejinKimm/ARCTraj"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Hugging Face
          </a>
          <a
            href="https://github.com/SejinKimm/ARCTrajViewer"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            GitHub
          </a>
          <a
            href="https://openreview.net/forum?id=AUoA3ztOLf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Paper (under review)
          </a>
        </div>
      </div>

      {/* 본문 레이아웃 */}
      <div className="flex flex-grow">
        {/* 왼쪽 사이드바 */}
        <div className="w-96 h-screen overflow-y-auto bg-gray-900 text-white p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">📁 Tasks</h2>
          <ul className="space-y-1">
            {tasks.map((task) => (
              <li key={task.id} className="flex flex-col">
                <div
                  className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${
                    selectedTaskId === task.id ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    if (selectedTaskId === task.id) {
                      setSelectedTaskId(null);
                      setSelectedLogId(null);
                      setStep(0);
                    } else {
                      setSelectedTaskId(task.id);
                      setSelectedLogId(null);
                      setStep(0);
                    }
                  }}
                >
                  {task.id}
                </div>

                {selectedTaskId === task.id && (
                  <ul className="ml-2 mt-1 space-y-1 border-l border-gray-700 pl-2 max-h-48 overflow-y-auto">
                    {task.logs.map((log) => (
                      <li
                        key={log.logId}
                        className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${
                          selectedLogId === log.logId ? "bg-gray-700" : ""
                        }`}
                        onClick={() => {
                          setSelectedLogId(log.logId);
                          setStep(0);
                        }}
                      >
                        log #{log.logId} (score: {log.score})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 오른쪽 Trajectory Viewer */}
        <div className="flex-grow bg-black text-white p-6 flex flex-col items-start">
          <h1 className="text-xl font-bold mb-4">Trajectory Viewer</h1>
          {currentState ? (
            <div>
              <p className="mb-2">Step {step}: {currentState.action}</p>
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${currentState.grid[0].length}, minmax(0, 2.5rem))`
                }}
              >
                {currentState.grid.map((row, y) =>
                  row.map((val, x) => {
                    const objectHere = currentState.objects.find(o => o.x === x && o.y === y);
                    const isSelected = objectHere !== undefined;
                    const colorClass = colorMap[objectHere ? objectHere.color : val] || "bg-gray-300";
                    const extraClass = isSelected ? "outline outline-2 outline-white" : "";
                    return <div key={`${x}-${y}`} className={`w-10 h-10 ${colorClass} border ${extraClass}`} />;
                  })
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No trajectory to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
