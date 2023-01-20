import { QueryClient, useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { deleteUser } from "../utils";

type TableDataProps = PropsWithChildren<{
  strong?: boolean;
}>;
export const TableData = ({ children, strong }: TableDataProps) => {
  return (
    <div
      className={classNames("text-xs not-italic text-left px-2", {
        "font-medium": strong,
      })}
    >
      {children}
    </div>
  );
};
