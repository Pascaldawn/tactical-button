// components/TacticBoard.js
import { useState } from 'react';

export default function TacticBoard() {
  const [homeColor, setHomeColor] = useState("#ff0000");
  const [awayColor, setAwayColor] = useState("#0000ff");
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [arrows, setArrows] = useState([]);

  const addPlayer = (team) => {
    const newPlayer = {
      id: Date.now(),
      x: 50,
      y: 50,
      team,
    };
    team === "home"
      ? setHomePlayers([...homePlayers, newPlayer])
      : setAwayPlayers([...awayPlayers, newPlayer]);
  };

  const drawArrow = (startX, startY, endX, endY) => {
    const newArrow = { id: Date.now(), startX, startY, endX, endY };
    setArrows([...arrows, newArrow]);
  };

  const eraseArrow = (id) => {
    setArrows(arrows.filter((arrow) => arrow.id !== id));
  };

  const resetBoard = () => {
    setHomePlayers([]);
    setAwayPlayers([]);
    setArrows([]);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-white">
        <h2 className="font-bold text-lg mb-2">Teams</h2>
        <div className="mb-4">
          <label className="block">Home Color</label>
          <input type="color" value={homeColor} onChange={(e) => setHomeColor(e.target.value)} />
          <button onClick={() => addPlayer("home")} className="block mt-2 bg-gray-200 px-2 py-1">Add Home Player</button>
        </div>
        <div className="mb-4">
          <label className="block">Away Color</label>
          <input type="color" value={awayColor} onChange={(e) => setAwayColor(e.target.value)} />
          <button onClick={() => addPlayer("away")} className="block mt-2 bg-gray-200 px-2 py-1">Add Away Player</button>
        </div>
        <div className="mb-4">
          <button onClick={resetBoard} className="bg-red-400 text-white px-3 py-2 rounded">Reset</button>
        </div>
      </div>

      {/* Field */}
      <div className="relative w-3/4 h-screen bg-green-600" id="field">
        {homePlayers.map((p) => (
          <div
            key={p.id}
            className="absolute w-8 h-8 rounded-full cursor-pointer"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: homeColor,
            }}
            draggable
          ></div>
        ))}
        {awayPlayers.map((p) => (
          <div
            key={p.id}
            className="absolute w-8 h-8 rounded-full cursor-pointer"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: awayColor,
            }}
            draggable
          ></div>
        ))}
        {/* Future: Add canvas or SVG arrows for drawing */}
      </div>
    </div>
  );
}

