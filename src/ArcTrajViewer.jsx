import React, { useState, useEffect } from "react";

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
          },
          {
            time: 1,
            grid: [
              [0, 3, 0],
              [3, 3, 0],
              [0, 0, 0]
            ],
            objects: [{ x: 1, y: 0, color: 3 }],
            action: "SelectCell (1,0)"
          },
          {
            time: 2,
            grid: [
              [0, 3, 0],
              [3, 3, 3],
              [0, 0, 0]
            ],
            objects: [{ x: 2, y: 1, color: 3 }],
            action: "SelectCell (2,1)"
          }
        ]
      },
      {
        logId: 3,
        score: 78978,
        trajectory: [
          {
            time: 0,
            grid: [
              [3, 0, 3],
              [0, 0, 0],
              [0, 0, 0]
            ],
            objects: [{ x: 0, y: 0, color: 3 }],
            action: "SelectCell (0,0)"
          },
          {
            time: 1,
            grid: [
              [3, 3, 3],
              [0, 0, 0],
              [0, 0, 0]
            ],
            objects: [{ x: 1, y: 0, color: 3 }],
            action: "SelectCell (1,0)"
          },
          {
            time: 2,
            grid: [
              [3, 3, 3],
              [0, 3, 0],
              [0, 0, 0]
            ],
            objects: [{ x: 1, y: 1, color: 3 }],
            action: "SelectCell (1,1)"
          }
        ]
      },
      {
        logId: 4,
        score: 40001,
        trajectory: [
          {
            time: 0,
            grid: [
              [0, 0, 0],
              [0, 3, 0],
              [0, 0, 3]
            ],
            objects: [{ x: 1, y: 1, color: 3 }],
            action: "SelectCell (1,1)"
          },
          {
            time: 1,
            grid: [
              [0, 3, 0],
              [0, 3, 0],
              [0, 0, 3]
            ],
            objects: [{ x: 1, y: 0, color: 3 }],
            action: "SelectCell (1,0)"
          },
          {
            time: 2,
            grid: [
              [0, 3, 0],
              [3, 3, 0],
              [0, 0, 3]
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
    logs: [
      {
        logId: 2,
        score: 22222,
        trajectory: [
          {
            time: 0,
            grid: [
              [0, 0, 3],
              [0, 0, 0],
              [0, 3, 0]
            ],
            objects: [{ x: 2, y: 0, color: 3 }],
            action: "SelectCell (2,0)"
          },
          {
            time: 1,
            grid: [
              [0, 3, 3],
              [0, 0, 0],
              [0, 3, 0]
            ],
            objects: [{ x: 1, y: 0, color: 3 }],
            action: "SelectCell (1,0)"
          },
          {
            time: 2,
            grid: [
              [0, 3, 3],
              [0, 0, 3],
              [0, 3, 0]
            ],
            objects: [{ x: 2, y: 1, color: 3 }],
            action: "SelectCell (2,1)"
          }
        ]
      },
      {
        logId: 5,
        score: 88776,
        trajectory: [
          {
            time: 0,
            grid: [
              [3, 0, 0],
              [0, 0, 0],
              [3, 0, 0]
            ],
            objects: [{ x: 0, y: 0, color: 3 }],
            action: "SelectCell (0,0)"
          },
          {
            time: 1,
            grid: [
              [3, 0, 0],
              [3, 0, 0],
              [3, 0, 0]
            ],
            objects: [{ x: 0, y: 1, color: 3 }],
            action: "SelectCell (0,1)"
          },
          {
            time: 2,
            grid: [
              [3, 0, 0],
              [3, 0, 0],
              [3, 3, 0]
            ],
            objects: [{ x: 1, y: 2, color: 3 }],
            action: "SelectCell (1,2)"
          }
        ]
      }
    ]
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
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [step, setStep] = useState(0);

  const selectedTask = sampleTasks.find((task) => task.id === selectedTaskId);
  const selectedLog = selectedTask?.logs.find((log) => log.logId === selectedLogId);
  const trajectory = selectedLog?.trajectory || [];
  const currentState = trajectory[step];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!trajectory.length) return;
      if (e.key === "ArrowRight") {
        setStep((prev) => Math.min(prev + 1, trajectory.length - 1));
      } else if (e.key === "ArrowLeft") {
        setStep((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trajectory]);

  return (
    <div className="flex min-h-screen w-screen font-sans">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2">📁 Tasks</h2>
          <ul className="mb-4">
            {sampleTasks.map((task) => (
              <li
                key={task.id}
                className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${
                  selectedTaskId === task.id ? "bg-gray-700" : ""
                }`}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setSelectedLogId(null);
                  setStep(0);
                }}
              >
                {task.id}
              </li>
            ))}
          </ul>

          {selectedTask && (
            <>
              <h2 className="text-lg font-semibold mb-2">📝 Logs</h2>
              <ul>
                {[...selectedTask.logs].sort((a, b) => b.score - a.score).map((log) => (
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
            </>
          )}
        </div>
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
                  const objectHere = currentState.objects.find((o) => o.x === x && o.y === y);
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
  );
}
