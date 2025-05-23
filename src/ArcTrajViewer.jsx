import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";

const HARDCODED_TASK_IDS = [
  "007bbfb7", "00d62c1b", "017c7c7b", "025d127b", "045e512c", "0520fde7", "05269061", "05f2a901", "06df4c85", "08ed6ac7", "09629e4f", "0962bcdd", "0a938d79", "0b148d64", "0ca9ddb6", "0d3d703e",
  "0dfd9992", "0e206a2e", "10fcaaa3", "11852cab", "1190e5a7", "137eaa0f", "150deff5", "178fcbfb", "1a07d186", "1b2d62fb", "1b60fb0c", "1bfc4729", "1c786137", "1caeab9d", "1cf80156", "1e0a9b12",
  "1e32b0e9", "1f0c79e5", "1f642eb9", "1f85a75f", "1f876c06", "1fad071e", "2013d3e2", "2204b7a8", "22168020", "22233c11", "2281f1f4", "228f6490", "22eb0ac0", "234bbc79", "23581191", "239be575",
  "23b5c85d", "253bf280", "25d487eb", "25d8a9c8", "25ff71a9", "264363fd", "272f95fa", "27a28665", "28bf18c6", "28e73c20", "29623171", "29c11459", "29ec7d0e", "2bcee788", "2bee17df", "2c608aff",
  "2dc579da", "2dd70a9a", "2dee498d", "31aa019c", "321b1fc6", "32597951", "3345333e", "3428a4f5", "3618c87e", "3631a71a", "363442ee", "36d67576", "36fdfd69", "3906de3d", "39a8645d", "39e1d7f9",
  "3aa6fb7a", "3ac3eb23", "3af2c5a8", "3bd67248", "3bdb4ada", "3befdf3e", "3c9b0459", "3de23699", "3e980e27", "3eda0437", "3f7978a0", "40853293", "4093f84a", "41e4d17e", "4258a5f9", "4290ef0e",
  "42a50994", "4347f46a", "444801d8", "445eab21", "447fd412", "44d8ac46", "44f52bb0", "4522001f", "4612dd53", "46442a0e", "469497ad", "46f33fce", "47c1f68c", "484b58aa", "48d8fb45", "4938f0c2",
  "496994bd", "49d1d64f", "4be741c5", "4c4377d9", "4c5c2cf0", "50846271", "508bd3b6", "50cb2852", "5117e062", "5168d44c", "539a4f51", "53b68214", "543a7ed5", "54d82841", "54d9e175", "5521c0d9",
  "5582e5ca", "5614dbcf", "56dc2b01", "56ff96f3", "57aa92db", "5ad4f10b", "5bd6f4ac", "5c0a986e", "5c2c9af4", "5daaa586", "60b61512", "6150a2bd", "623ea044", "62c24649", "63613498", "6430c8c4",
  "6455b5f5", "662c240a", "67385a82", "673ef223", "6773b310", "67a3c6ac", "67a423a3", "67e8384a", "681b3aeb", "6855a6e4", "68b16354", "694f12f3", "6a1e5592", "6aa20dc0", "6b9890af", "6c434453",
  "6cdd2623", "6cf79266", "6d0160f0", "6d0aefbc", "6d58a25d", "6d75e8bb", "6e02f1e3", "6e19193c", "6e82a1ae", "6ecd11f4", "6f8cd79b", "6fa7a44f", "72322fa7", "72ca375d", "73251a56", "7447852a",
  "7468f01a", "746b3537", "74dd1130", "75b8110e", "760b3cac", "776ffc46", "77fdfe62", "780d0b14", "7837ac64", "794b24be", "7b6016b9", "7b7f7511", "7c008303", "7ddcd7ec", "7df24a62", "7e0986d6",
  "7f4411dc", "7fe24cdd", "80af3007", "810b9b61", "82819916", "83302e8f", "834ec97d", "8403a5d5", "846bdb03", "855e0971", "85c4e7cd", "868de0fa", "8731374e", "88a10436", "88a62173", "890034e9",
  "8a004b2b", "8be77c9e", "8d5021e8", "8d510a79", "8e1813be", "8e5a5113", "8eb1be9a", "8efcae92", "8f2ea7aa", "90c28cc7", "90f3ed37", "913fb3ed", "91413438", "91714a58", "9172f3a0", "928ad970",
  "93b581b8", "941d9a10", "94f9d214", "952a094c", "9565186b", "95990924", "963e52fc", "97999447", "97a05b5b", "98cf29f8", "995c5fa3", "99b1bc43", "99fa7670", "9aec4887", "9af7a82c", "9d9215db",
  "9dfd6313", "9ecd008a", "9edfc990", "9f236235", "a1570a43", "a2fd1cf0", "a3325580", "a3df8b1e", "a416b8f3", "a48eeaf7", "a5313dff", "a5f85a15", "a61ba2ce", "a61f2674", "a64e4611", "a65b410d",
  "a68b268e", "a699fb00", "a740d043", "a78176bb", "a79310a0", "a85d4709", "a87f7484", "a8c38be5", "a8d7556c", "a9f96cdd", "aabf363d", "aba27056", "ac0a08a4", "ae3edfdc", "ae4f1146", "aedd82e4",
  "af902bf9", "b0c4d837", "b190f7f5", "b1948b0a", "b230c067", "b27ca6d3", "b2862040", "b527c5c6", "b548a754", "b60334d2", "b6afb2da", "b7249182", "b775ac94", "b782dc8a", "b8825c91", "b8cdaf2b",
  "b91ae062", "b94a9452", "b9b7f026", "ba26e723", "ba97ae07", "bb43febb", "bbc9ae5d", "bc1d5164", "bd4472b8", "bda2d7a6", "bdad9b1f", "be94b721", "beb8660c", "c0f76784", "c1d99e64", "c3e719e8",
  "c3f564a4", "c444b776", "c59eb873", "c8cbb738", "c8f0f002", "c909285e", "c9e6f938", "c9f8e694", "caa06a1f", "cbded52d", "cce03e0d", "cdecee7f", "ce22a75a", "ce4f8723", "ce602527", "ce9e57f2",
  "cf98881b", "d037b0a7", "d06dbe63", "d07ae81c", "d0f5fe59", "d10ecb37", "d13f3404", "d22278a0", "d23f8c26", "d2abd087", "d364b489", "d406998b", "d43fd935", "d4469b4b", "d4a91cb9", "d4f3cd78",
  "d511f180", "d5d6de2d", "d631b094", "d687bc17", "d6ad076f", "d89b689b", "d8c310e9", "d90796e8", "d9f24cd1", "d9fac9be", "dae9d2b5", "db3e9e38", "db93a21d", "dbc1a6ce", "dc0a314f", "dc1df850",
  "dc433765", "ddf7fa4f", "de1cd16c", "ded97339", "e179c5f4", "e21d9049", "e26a3af2", "e3497940", "e40b9e2f", "e48d4e1a", "e5062a87", "e509e548", "e50d258f", "e6721834", "e73095fd", "e76a88a6",
  "e8593010", "e8dc4411", "e9614598", "e98196ab", "e9afcf9a", "ea32f347", "ea786f4a", "eb281b96", "eb5a1d5d", "ec883f72", "ecdecbb3", "ed36ccf7", "ef135b50", "f15e1fac", "f1cefba8", "f25fbde4",
  "f25ffba3", "f2829549", "f35d900a", "f5b8619d", "f76d97a5", "f8a8fe49", "f8b3ba0a", "f8c80d96", "f8ff0b80", "f9012d9b", "fafffa47", "fcb5c309", "fcc82909", "feca6190", "ff28f65a", "ff805c23"
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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (delta < -50) {
        setStep(prev => Math.min(prev + 1, trajectory.length - 1));
      } else if (delta > 50) {
        setStep(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [trajectory]);

  return (
    <div className="flex flex-col min-h-screen w-[calc(100vw-1rem)] overflow-hidden font-sans">
      {/* 상단 헤더 */}
      <div className="bg-gray-900 text-white text-center py-6 shadow-md">
        <h1 className="text-4xl font-black mb-2">ARCTraj</h1>
        <p className="text-xl text-gray-300 mb-4">
          Human Reasoning Trajectories Collected From Interactive Sessions On The Abstraction and Reasoning Corpus
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://huggingface.co/datasets/SejinKimm/ARCTraj"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          >
            <img src="./hf-logo.svg" alt="HF" className="w-5 h-5" />
            Hugging Face
          </a>
          <a
            href="./ARCTraj_paper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          >
            <img src="./pdf-logo.svg" alt="PDF" className="w-5 h-5" />
            Paper
          </a>
        </div>
      </div>

      {/* 본문 레이아웃 */}
      <div className="flex flex-grow w-full">
        {/* 왼쪽 사이드바 */}
        <div className="w-[28rem] h-screen overflow-y-auto bg-gray-900 text-white p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4 sticky top-0 bg-gray-900 z-10 py-2">📁 Tasks</h2>
          {loading ? (
            <p className="text-gray-400">Loading tasks...</p>
          ) : (
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
          )}
        </div>

        {/* 오른쪽 Trajectory Viewer */}
        <div className="flex-grow bg-black text-white p-6 flex flex-col items-start">
          <h1 className="text-xl font-bold mb-4">🔍 Trajectory Viewer</h1>
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
            <p className="text-gray-400">Please Select Task and Log.</p>
          )}
        </div>
      </div>
    </div>
  );
}
