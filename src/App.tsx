import { UserList } from "./pages/UserList";
import { generateDummyUsers } from "./utils";

function App() {
  return (
    <div className="App w-full">
      <h1 className="text-2xl font-bold backdrop-brightness-100 text-center my-4">
        Techwondoe Assignment
      </h1>
      <div className="grid place-items-center">
        <UserList></UserList>
      </div>
    </div>
  );
}

export { App };
