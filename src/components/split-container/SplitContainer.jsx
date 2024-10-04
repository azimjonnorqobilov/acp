import { useMemo, useState } from "react";
import Split from "@uiw/react-split";

const calculateHeightPercentage = (count) => {
  const preSize =
    count < 20
      ? (count * 64) / 20 +
        (count <= 7 ? 4 : count <= 10 ? 3 : count <= 14 ? 2 : count <= 17 ? 1 : 0)
      : 64;
  const nextSize = 100 - preSize;
  return { preSize, nextSize };
};

function SplitContainer({ loadsCount, loads, availableLoads }) {
  const [defaulatSize, setDefaultSize] = useState(true);
  const [oldLoadsCount, setOldLoadsCount] = useState(null);
  const [heights, setHeights] = useState({ preSize: 16, nextSize: 84 });

  const calculatedHeights = useMemo(() => calculateHeightPercentage(loadsCount), [loadsCount]);

  useMemo(() => {
    (defaulatSize ||
      (oldLoadsCount &&
        oldLoadsCount > loadsCount &&
        heights?.preSize > calculatedHeights?.preSize)) &&
      setHeights(calculatedHeights);

    setOldLoadsCount(loadsCount);
  }, [loadsCount]);

  const handleDraggingSplit = (preSize, nextSize) =>
    preSize < 84 && setHeights({ preSize, nextSize });

  const handleDraggingEndSplit = (preSize, nextSize) => {
    setDefaultSize(false);

    if (preSize > 64) {
      if (loadsCount < 20) {
        setHeights(calculatedHeights);
        setDefaultSize(true);
      } else setHeights({ preSize: 64, nextSize: 36 });
    } else {
      if (calculatedHeights?.preSize < preSize) {
        setHeights(calculatedHeights);
        setDefaultSize(true);
      } else setHeights({ preSize, nextSize });
    }

    // setHeights(
    //   preSize > 34
    //     ? loadsCount < 10
    //       ? calculatedHeights
    //       : { preSize: 34, nextSize: 66 }
    //     : calculatedHeights?.preSize < preSize
    //     ? calculatedHeights
    //     : { preSize, nextSize }
    // );
  };

  return (
    <Split
      onDragging={handleDraggingSplit}
      onDragEnd={handleDraggingEndSplit}
      mode="vertical"
      className="overflow-hidden"
      renderBar={({ onMouseDown, ...props }) => {
        return (
          <div {...props} className="relative">
            <button
              onMouseDown={onMouseDown}
              className="bg-resizable-button bg-no-repeat bg-center bg-contain h-5 overflow-hidden px-4 py-1 rounded-lg absolute bottom-[0.15rem] left-[calc(50%-10px)] cursor-row-resize after:none"
            />
          </div>
        );
      }}
    >
      <div
        className="w-full min-h-[10rem] px-4 pb-2 pt-2 relative"
        style={{ height: `${heights?.preSize}%` }}
      >
        {loads}
      </div>

      <div className="w-full min-h-[10rem] px-4 pb-2" style={{ height: `${heights?.nextSize}%` }}>
        {availableLoads}
      </div>
    </Split>
  );
}

export default SplitContainer;
