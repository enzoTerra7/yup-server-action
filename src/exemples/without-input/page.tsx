import React from "react";
import { useServerAction } from "use-server-action";
import { getMyUserAction } from "./_action";

export default function CreateUserPage() {
  const { execute, isPending, isSuccess, isError, error, data } =
    useServerAction(getMyUserAction, {
      onSuccess(input) {
        alert("User founded");
        console.log(input);
      },
      onError(err) {
        alert("Error finding user");
        console.error(err);
      },
    });

  if (isPending) {
    return <button disabled>Finding user...</button>;
  }

  if (isError) {
    return (
      <div>
        <h1>Error finding user</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div>
        <h1>User founded</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>Find user</h1>
      <button type="button" onClick={() => execute()}>
        Find
      </button>
    </div>
  );
}
