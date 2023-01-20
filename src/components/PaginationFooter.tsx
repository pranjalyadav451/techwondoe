import { Table } from "@tanstack/react-table";
import { UserTableColumn } from "./ColumnBuilder";

type PaginationProps = {
  tableInstance: Table<UserTableColumn>;
};

function PaginationFooter({ tableInstance }: PaginationProps) {
  return (
    <div className="mb-8">
      <div className="w-full grid grid-flow-col gap-2 justify-between">
        <div className="w-full">
          <button
            className="pagination-button"
            onClick={() => tableInstance.setPageIndex(0)}
            disabled={!tableInstance.getCanPreviousPage()}
          >
            {"<<"}
          </button>
        </div>

        <div className="w-full">
          <button
            className="pagination-button"
            onClick={() => tableInstance.previousPage()}
            disabled={!tableInstance.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="pagination-button"
            onClick={() => tableInstance.nextPage()}
            disabled={!tableInstance.getCanNextPage()}
          >
            {">"}
          </button>
        </div>

        <div className="flex flex-row w-full">
          <button
            className="pagination-button"
            onClick={() =>
              tableInstance.setPageIndex(tableInstance.getPageCount() - 1)
            }
            disabled={!tableInstance.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
      </div>
      <div className="ml-2 mt-2">
        <span className="grid grid-flow-col w-full">
          <p className="text-sm">
            {"Page "}
            <strong className="text-sm">
              {tableInstance.getState().pagination.pageIndex + 1} of{" "}
              {tableInstance.getPageCount()}
            </strong>
          </p>
        </span>
      </div>
    </div>
  );
}

export { PaginationFooter };
