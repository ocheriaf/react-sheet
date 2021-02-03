import React from "react";
import { createCallSignature } from "typescript";
import { generateMatrix } from "./helpers/generateData";
import { useSheet, UseSheetResult } from "./hooks/useSheet";
import logo from "./logo.svg";
import "./App.css";
const data = generateMatrix(10);

const App = () => {
  const { sheetAttributes, rows } = useSheet<number>({
    data,
    onCellUpdated: (...rest) => {
      console.log(rest);
    },
    onContextMenu: (ev) => {
      console.log(ev);
    },
  });

  return (
    <div className="App">
      <div className="sheet" {...sheetAttributes}>
        {rows.map(({ rowAttributes, cells }) => (
          <div className="row" {...rowAttributes}>
            {cells.map((c) => (
              <div
                {...c.cellAttributes}
                className={`cell ${c.isActive ? "active" : ""}`}
              >
                {c.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
