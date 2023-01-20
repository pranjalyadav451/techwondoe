import { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { addUser, BASE_URL, DEFAULT_USER, User, USER_ROLES } from "../utils";
import { faker } from "@faker-js/faker";
import { PaginationState } from "@tanstack/react-table";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { json2csv } from "json-2-csv";

type DownloadStatus = "idle" | "loading" | "success" | "error";

function Header({ paginationDetails }: { paginationDetails: PaginationState }) {
  const [open, setOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle");
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState<User>(DEFAULT_USER);
  const userMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users", paginationDetails]);
    },
  });

  const handleDataDownload = () => {
    setDownloadStatus("loading");
    axios
      .get(`${BASE_URL}/Users`)
      .then(res => {
        const { data } = res;
        json2csv(data, (err, csv) => {
          if (err || !csv) {
            const error = {
              ...err,
              message: err?.message || "Unable to convert data to CSV",
            };
            throw error;
          }
          const element = document.createElement("a");
          element.style.display = "none";
          const file = new Blob([csv], { type: "text/csv" });
          element.href = URL.createObjectURL(file);
          element.download = "Users.csv";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
          document.body.removeChild(element);
          URL.revokeObjectURL(element.href);
          setDownloadStatus("success");
        });
      })
      .catch(err => {
        setDownloadStatus("error");
        throw err;
      });
  };

  return (
    <>
      <div className="flex justify-between text-sm p-2 w-full">
        <div>
          <h2 className="text-lg font-bold">Users</h2>
          <p className="text-xs">Manage Your User settings here.</p>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="btn-primary"
            onClick={() => {
              handleDataDownload();
            }}
            disabled={downloadStatus === "loading"}
          >
            Download as CSV
          </button>
          <button className="btn-primary" onClick={() => setOpen(true)}>
            Add User
          </button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          modal: "w-1/2 rounded-md border-neutral-400",
        }}
      >
        <h2 className="text-lg font-bold">Add User</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            const finalUser = {
              ...newUser,
              last_login: new Date().toISOString(),
              username: faker.internet.userName(),
              id: faker.datatype.uuid(),
            };
            setNewUser(finalUser);

            if (finalUser.name === "") {
              alert("Name is required");
            }
            userMutation.mutate(finalUser);
            setOpen(false);
          }}
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={newUser.name}
              onChange={e => {
                setNewUser({ ...newUser, name: e.target.value });
              }}
              required
            />
          </div>
          <div>
            <div className="flex flex-col mb-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={newUser.email}
                required
                onChange={e => {
                  setNewUser({ ...newUser, email: e.target.value });
                }}
              />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col mb-2 w-2/5">
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  value={newUser.status}
                  onChange={e => {
                    setNewUser({
                      ...newUser,
                      status: e.target.value as typeof newUser.status,
                    });
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex flex-col mb-2 w-2/5">
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  id="role"
                  value={newUser.role}
                  onChange={e => {
                    setNewUser({ ...newUser, role: e.target.value });
                  }}
                >
                  {USER_ROLES.map((role, i) => (
                    <option key={i} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="btn-primary bg-blue-600 outline-none text-white"
                type="submit"
              >
                Add User
              </button>
              <button
                className="btn-primary bg-red-500 outline-none text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export { Header };
