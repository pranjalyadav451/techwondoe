import { useMutation, useQueryClient } from "@tanstack/react-query";
import { flexRender, Table } from "@tanstack/react-table";
import classNames from "classnames";
import Modal from "react-responsive-modal";
import { DEFAULT_USER, deleteUser, updateUser, User } from "../utils";
import { UserTableColumn } from "./ColumnBuilder";
import { PaginationFooter } from "./PaginationFooter";
import { TableData } from "./TableData";
import "react-responsive-modal/styles.css";
import { useState } from "react";

type TableProps = {
  tableInstance: Table<UserTableColumn>;
  status?: "loading" | "error" | "success";
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};

export const TableView = ({ tableInstance, pagination }: TableProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [userUpdateDetails, setUserUpdateDetails] =
    useState<User>(DEFAULT_USER);

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users", pagination]);
    },
  });

  const editUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users", pagination]);
    },
  });

  const userMutations = {
    delete: deleteUserMutation,
    edit: deleteUserMutation,
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          {tableInstance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={classNames(
                    "min-w-5 text-sm font-medium text-left px-2 cursor-pointer select-none",
                    {
                      "text-center":
                        header.id === "edit" || header.id === "delete",
                    }
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map((row, i) => {
            return (
              <tr
                key={row.id}
                className={classNames({
                  "bg-slate-50": i % 2 === 0,
                  "bg-neutral-100": i % 2,
                })}
              >
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {["edit", "delete"].includes(cell.column.id) ? (
                        <button
                          key={cell.id}
                          className="btn-primary bg-red-500 text-white"
                          onClick={() => {
                            const type = cell.column.id;
                            if (type === "edit") {
                              setUserUpdateDetails(() => {
                                setEditModalOpen(true);
                                return row.original as User;
                              });
                            } else if (type === "delete") {
                              confirm("Are you sure you want to delete?") &&
                                userMutations[type].mutate(row.original.id);
                            }
                          }}
                        >
                          {cell.column.id === "edit" ? "Edit" : "Delete"}
                        </button>
                      ) : (
                        <TableData
                          key={cell.id}
                          strong={cell.column.id === "name"}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableData>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <PaginationFooter tableInstance={tableInstance} />

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2>Edit User</h2>
        <div className="flex flex-col mb-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={userUpdateDetails.name}
            className=""
            onChange={e => {
              setUserUpdateDetails({
                ...userUpdateDetails,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col mb-2 w-2/5">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              id="status"
              value={userUpdateDetails.status}
              onChange={e => {
                setUserUpdateDetails({
                  ...userUpdateDetails,
                  status: e.target.value as User["status"],
                });
              }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="btn-primary bg-blue-600 outline-none text-white"
            onClick={() => {
              editUserMutation.mutate(userUpdateDetails);
              setEditModalOpen(false);
            }}
          >
            Save
          </button>
          <button
            className="btn-primary bg-red-500 outline-none text-white"
            onClick={() => setEditModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};
