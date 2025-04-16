import React from "react";
import { useServerAction } from "use-server-action";
import { saveUserAction } from "./_action";

export default function CreateUserPage() {
  const { execute, isPending, isSuccess, isError, error, data } =
    useServerAction(saveUserAction, {
      onSuccess(input) {
        alert("User created");
        console.log(input);
      },
      onError(err) {
        alert("Error creating user");
        console.error(err);
      },
    });

  if (isPending) {
    return <button disabled>Creating user...</button>;
  }

  if (isError) {
    return (
      <div>
        <h1>Error creating user</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div>
        <h1>User created</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>Create user</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          execute({
            name: e.currentTarget.userName.value,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
          });
        }}
      >
        <label htmlFor="userName">Name</label>
        <input id="userName" name="userName" type="text" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button type="submit">Create user</button>
      </form>
    </div>
  );
}
