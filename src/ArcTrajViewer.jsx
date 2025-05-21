import React, { useState } from "react";

// 샘플 데이터 구조
const sampleTasks = [
  {
    id: "2204b7a8",
    logs: [
      {
        logId: 1,
        score: 34524,
        trajectory: [
          {
            time: 0,
            grid: [
              [0, 0, 0],
              [3, 3, 0],
              [0, 0, 0]
            ],
            objects: [{ x: 0, y: 1, color: 3 }],
            action: "SelectCell (0,1)"
          }
        ]
      }
    ]
  },
  {
    id: "d3f4ac12",
    logs: []
  }
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

export default function ARCTrajViewer() {
  const [selectedTaskId, setSelectedTaskId] = useState(sampleTasks[0].id);
  const [selectedLogId, setSelectedLogId] = useState(sampleTasks[0].logs[0].logId);

  const selectedTask = sampleTasks.find((task) => task.id === selectedTaskId);
  const selectedLog = selectedTask?.logs.find((log) => log.logId === selectedLogId);
  const firstState = selectedLog?.trajectory[0];

  return (
    <div className="flex h-screen font-sans">
      {/* 왼쪽 사이드바 */}
      <div className="w-1/4 bg-gray-900 text-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">📁 Tasks</h2>
          <ul>
            {sampleTasks.map((task) => (
              <li
                key={task.id}
                className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${
                  selectedTaskId === task.id ? "bg-gray-700" : ""
                }`}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  if (task.logs.length > 0) {
                    setSelectedLogId(task.logs[0].logId);
                  }
                }}
              >
                {task.id}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">📝 Logs</h2>
          <ul>
            {selectedTask?.logs.map((log) => (
              <li
                key={log.logId}
                className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${
                  selectedLogId === log.logId ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedLogId(log.logId)}
              >
                log #{log.logId} (score: {log.score})
              </li>
            )) || <li className="text-sm text-gray-400">No logs</li>}
          </ul>
        </div>
      </div>

      {/* 오른쪽 Trajectory Viewer */}
      <div className="flex-1 bg-black text-white p-6">
        <h1 className="text-xl font-bold mb-4">Trajectory Viewer</h1>
        {firstState ? (
          <div>
            <p className="mb-2">First Step: {firstState.action}</p>
            <div className={`grid grid-cols-${firstState.grid[0].length} gap-1`}>
              {firstState.grid.map((row, y) =>
                row.map((val, x) => {
                  const objectHere = firstState.objects.find((o) => o.x === x && o.y === y);
                  const colorClass = colorMap[objectHere ? objectHere.color : val] || "bg-gray-300";
                  return <div key={`${x}-${y}`} className={`w-10 h-10 ${colorClass} border`} />;
                })
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No trajectory to display.</p>
        )}
      </div>
    </div>
  );
}
