import { useEffect } from "react";
import Router from "next/router";
import { getAuthenticatedUserFromSession } from "@/utils/passage";
import { PassageUser } from "@passageidentity/passage-elements/passage-user";

export default function Dashboard({ isAuthorized, userID, todos }) {
  useEffect(() => {
    if (!isAuthorized) {
      Router.push("/");
    }
  });

  const signOut = async () => {
    new PassageUser().signOut();
    Router.push("/");
  };

  return (
    <div className="container m-auto text-center bg-slate-600">
      <h1>Welcome {userID}! </h1>
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

  return {
    props: {
      isAuthorized: loginProps.isAuthorized ?? false,
      userID: loginProps.userID ?? "",
    },
  };
};
