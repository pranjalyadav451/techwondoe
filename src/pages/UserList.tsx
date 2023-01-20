import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { deleteUser, getUsers, User, UserReponse } from "../utils";
import { productsColumns, UserTableColumn } from "../components/ColumnBuilder";
import { Header } from "../components/Header";
import { TableView } from "../components/TableView";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const UserList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const getUsersOptions = {
    pageIndex,
    pageSize,
  };
  const userQueryObj = useQuery<UserReponse>({
    queryKey: ["users", getUsersOptions],
    queryFn: () => {
      return getUsers(getUsersOptions);
    },
    keepPreviousData: true,
  });
  const { data, status } = userQueryObj;
  const defaultData = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const tableInstance = useReactTable({
    getPaginationRowModel: getPaginationRowModel(),
    columns: productsColumns,
    data: (data?.userData ?? defaultData) as UserTableColumn[],
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      sorting,
    },
    pageCount: data?.pageCount ?? -1,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full sm:w-4/5">
      <div className="border-b-2 border-slate-200">
        <Header paginationDetails={pagination}></Header>
      </div>
      <TableView
        tableInstance={tableInstance}
        pagination={pagination}
        status={status}
      />
    </div>
  );
};
