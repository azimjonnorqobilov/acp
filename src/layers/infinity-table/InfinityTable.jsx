import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import { InfiniteLoader } from "react-virtualized";
import { BarLoader } from "react-spinners";

import "react-virtualized/styles.css";

function InfinityTable({
  list,
  header = false,
  rowCount = 0,
  rowHeight = 45,
  renderItem,
  hasNextPage,
  loadNextPage,
  renderHeader,
  isNextPageLoading,
}) {
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  const isRowLoaded = ({ index }) => !hasNextPage || index < list?.length;

  const rowRenderer = ({ index, key, style }) => {
    const item = list?.[index];

    return (
      <div key={key} style={style}>
        {!isRowLoaded({ index }) ? (
          <div className="h-full flex justify-center items-end">
            <BarLoader width="100%" height={6} color="#3F96D0" />
          </div>
        ) : (
          renderItem && renderItem(index, item)
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      {header && renderHeader()}

      <div className={`w-full ${header ? "h-[calc(100%-23.98px)]" : "h-full"}`}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={rowCount}
              >
                {({ onRowsRendered, registerChild }) => (
                  <List
                    width={width}
                    height={height}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={rowRenderer}
                    className="table-scrollbar"
                  />
                )}
              </InfiniteLoader>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}

export default InfinityTable;
