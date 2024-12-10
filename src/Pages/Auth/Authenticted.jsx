import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Navigate } from "react-router-dom";
import UserProvider from "./UserProvider";
import Group from "../../components/assets/Group";

export const IS_LOGGED_IN = gql`
  {
    me {
      id
      avatar
      name
    }
  }
`;

function Authenticated({ children }) {
    const { loading, error, data } = useQuery(IS_LOGGED_IN);

    if (loading) return <div class='w-full h-full flex items-center justify-center '>
      <Group className='w-20 h-20' />
    </div>;

    if (error) {
        // Custom error handling, redirect to an error page, etc.
        return <p>Error: {error.message}</p>;
    }

    if (!data.me) {
        return <Navigate to="/" replace />;
    }

    return (
        <UserProvider userData={data.me}>
            {children}
        </UserProvider>
    );
}

export default Authenticated;
