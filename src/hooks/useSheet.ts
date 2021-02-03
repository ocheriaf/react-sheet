import React, { CSSProperties, useEffect, useState } from "react";

interface UseSheetArguments<T> {
  data: T[][];
  onCellUpdated(cellValue: string | null, row: number, column: number): void;
  onContextMenu?(ev: React.MouseEvent): void;
}

interface Cell<T> {
  isActive: boolean;
  value: T;
  cellAttributes: {
    key: string;
    onClick(ev: React.MouseEvent): void;
    contentEditable: boolean;
    suppressContentEditableWarning: boolean;
    onBlur(ev: React.FocusEvent): void;
    onContextMenu?(ev: React.MouseEvent): void;
  };
}

interface Row<T> {
  rowAttributes: {
    key: string;
    style: any;
  };
  cells: Cell<T>[];
}

interface SheetProps {
  onKeyUp(ev: React.KeyboardEvent): void;
  style: CSSProperties;
  tabIndex: number;
}

export interface UseSheetResult<T> {
  sheetAttributes: SheetProps;
  rows: Row<T>[];
}

export const useSheet = <T>({
  data,
  onCellUpdated,
  onContextMenu,
}: UseSheetArguments<T>): UseSheetResult<T> => {
  // Selection hooks
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: number;
  } | null>(null);

  // Sheet attributes
  const sheetAttributes = {
    style: {
      display: "grid",
      gridTemplateRows: "repeat(" + data.length + ", 1fr)",
    },
    onKeyUp: (ev: React.KeyboardEvent) => {
      switch (ev.key) {
        case "ArrowDown": {
          if (selectedCell && selectedCell.row < data.length - 1) {
            setSelectedCell((selectedCell) => {
              selectedCell = selectedCell as {
                row: number;
                column: number;
              };
              return {
                row: selectedCell.row + 1,
                column: selectedCell.column,
              };
            });
          }
          break;
        }
        case "ArrowUp": {
          if (selectedCell && selectedCell.row > 0) {
            setSelectedCell((selectedCell) => {
              selectedCell = selectedCell as {
                row: number;
                column: number;
              };
              return {
                row: selectedCell.row - 1,
                column: selectedCell.column,
              };
            });
          }
          break;
        }
        case "ArrowLeft": {
          if (selectedCell && selectedCell.column > 0) {
            setSelectedCell((selectedCell) => {
              selectedCell = selectedCell as {
                row: number;
                column: number;
              };
              return {
                row: selectedCell.row,
                column: selectedCell.column - 1,
              };
            });
          }
          break;
        }
        case "ArrowRight": {
          if (selectedCell && selectedCell.column < data.length - 1) {
            setSelectedCell((selectedCell) => {
              selectedCell = selectedCell as {
                row: number;
                column: number;
              };
              return {
                row: selectedCell.row,
                column: selectedCell.column + 1,
              };
            });
          }
          break;
        }
      }
    },
    tabIndex: -1,
  };
  // Rows
  const rows = data.map((r, i) => ({
    cells: r.reduce((acc, v, j): Cell<T>[] => {
      // Cells
      return [
        ...acc,
        {
          isActive: Boolean(
            selectedCell && selectedCell.row === i && selectedCell.column === j
          ),
          value: v,
          cellAttributes: {
            key: `cell${i}:${j}`,
            contentEditable: true,
            suppressContentEditableWarning: true,
            onBlur: (ev) => {
              onCellUpdated(ev.target.textContent, i, j);
            },
            onClick: (...rest: any[]) => {
              setSelectedCell((selectedCell) =>
                selectedCell &&
                selectedCell.row === i &&
                selectedCell.column === j
                  ? null
                  : { row: i, column: j }
              );
            },
            onContextMenu,
          },
        },
      ];
    }, [] as Cell<T>[]),
    // Row attributes
    rowAttributes: {
      key: `row${i}`,
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(" + data.length + ", 1fr)",
      },
    },
  }));

  return {
    sheetAttributes: sheetAttributes,
    rows: rows,
  };
};
