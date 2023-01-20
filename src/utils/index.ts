import { faker } from "@faker-js/faker";
import axios from "axios";

export const BASE_URL = "https://attractive-top-hat-duck.cyclic.app";

export const USER_ROLES = [
  "ADMIN",
  "USER",
  "GUEST",
  "SALES",
  "MANAGER",
  "CEO",
  "CFO",
];

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  status: "active" | "inactive";
  role: (typeof USER_ROLES)[number];
  last_login: string;
};

export const DEFAULT_USER: User = {
  id: "",
  name: "",
  email: "",
  username: "",
  status: "inactive",
  role: "GUEST",
  last_login: "",
};
const DEFAULT_USER_COUNT = 40;
export type UserReponse = {
  userData: User[];
  pageCount: number;
};

export const generateDummyUsers = (count = DEFAULT_USER_COUNT): User[] => {
  const usersList: User[] = [];
  for (let i = 0; i < count; i++) {
    usersList.push({
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      status: faker.helpers.arrayElement(["active", "inactive"]),
      role: faker.helpers.arrayElement(USER_ROLES),
      last_login: faker.date.recent().toISOString(),
    });
  }
  return usersList;
};

export const getUsers = async (options: {
  pageIndex: number;
  pageSize: number;
}): Promise<UserReponse> => {
  const response = await axios.get<User[]>(
    `${BASE_URL}/users?_page=${options.pageIndex + 1}&_limit=${
      options.pageSize
    }`
  );
  const totalCount = (response.headers["x-total-count"] ?? 0) as number;
  return {
    userData: response.data,
    pageCount: Math.ceil(totalCount / options.pageSize),
  };
};

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/users/${id}`);
  return response.data;
};

export const addUser = async (user: User) => {
  const response = await axios.post(`${BASE_URL}/users`, user);
  return response.data;
};

export const updateUser = async (userUpdateDetails: User) => {
  const response = await axios.put(
    `${BASE_URL}/users/${userUpdateDetails.id}`,
    userUpdateDetails
  );
  return response.data;
};
