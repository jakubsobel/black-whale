import { useEffect, useState } from "react";
import Router from "next/router";
import { getAuthenticatedUserFromSession } from "@/utils/passage";
import { getSupabase } from "../utils/supabase";
import { PassageUser } from "@passageidentity/passage-elements/passage-user";

export default function Dashboard({ isAuthorized, userID, initialTodos }) {
  const [todos, setTodos] = useState(initialTodos);

  useEffect(() => {
    if (!isAuthorized) {
      Router.push("/");
    }
  });

  const signOut = async () => {
    new PassageUser().signOut();
    Router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const todo = data.get("todo");
    const res = await fetch("/api/addTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo, userID }),
    }).then((res) => res.json());
    setTodos([...todos, res]);
  };

  return (
    <div className="container m-auto text-center bg-slate-600 p-4">
      <h1>Welcome {userID}! </h1>
      <br></br>
      <div className="flex flex-col">
        {todos?.length > 0 ? (
          todos.map((todo) => <li key={todo.id}>{todo.title}</li>)
        ) : (
          <p>You have completed all todos!</p>
        )}
      </div>
      <br></br>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        <label className="contents">
          <span className="font-semibold">Add a Todo:</span>
          <input type="text" name="todo" className="text-black" />
        </label>
        <button className="p-2 bg-slate-800">Submit</button>
      </form>
      <br></br>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const loginProps = await getAuthenticatedUserFromSession(
    context.req,
    context.res
  );

  if (loginProps.isAuthorized) {
    const supabase = getSupabase(loginProps.userID);
    const { data } = await supabase
      .from("todo")
      .select()
      .is("is_complete", false);

    return {
      props: {
        isAuthorized: loginProps.isAuthorized ?? false,
        userID: loginProps.userID ?? "",
        initialTodos: data ?? [],
      },
    };
  } else {
    return {
      props: {
        isAuthorized: loginProps.isAuthorized ?? false,
        userID: loginProps.userID ?? "",
      },
    };
  }
};
