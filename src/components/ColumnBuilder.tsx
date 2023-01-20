import { QueryClient, useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import classNames from "classnames";
import { deleteUser, User } from "../utils";

export type UserTableColumn = User & {
  edit: string;
  delete: string;
};

const queryClient = new QueryClient();
const columnsHelper = createColumnHelper<UserTableColumn>();

export const productsColumns = [
  columnsHelper.accessor("name", {
    cell: info => <span className="block">{info.getValue()}</span>,
    header: () => <span>Name</span>,
  }),
  columnsHelper.accessor("email", {
    cell: info => (
      <span className="lowercase block font-medium opacity-60">
        {info.getValue()}
      </span>
    ),
    header: () => <span>Email</span>,
  }),
  columnsHelper.accessor("status", {
    cell: info => {
      const value = info.getValue();
      return (
        <span
          className={classNames(
            "block w-fit px-2 py-1 font-medium text-slate-800 h-full rounded-xl",
            {
              "bg-green-200": value === "active",
              "bg-red-200": value !== "active",
            }
          )}
        >
          {value}
        </span>
      );
    },
    header: () => <span>Status</span>,
  }),
  columnsHelper.accessor("role", {
    cell: info => {
      return <span className="font-medium uppercase">{info.getValue()}</span>;
    },
    header: () => <span>Role</span>,
  }),
  columnsHelper.accessor("last_login", {
    cell: info => {
      const lastLogin = new Date(info.getValue()).toLocaleString();
      return <span>{lastLogin}</span>;
    },
    header: () => <span>Last Login</span>,
    sortingFn: "datetime",
  }),
  columnsHelper.accessor("edit", {
    cell: info => (
      <span>
        <button className="bg-red-500 text-neutral-200  outline-none">
          Edit
        </button>
      </span>
    ),
    header: () => <span>Edit</span>,
    enableSorting: false,
  }),
  columnsHelper.accessor("delete", {
    cell: info => <span></span>,
    enableSorting: false,
    header: () => <span>Delete</span>,
  }),
];
