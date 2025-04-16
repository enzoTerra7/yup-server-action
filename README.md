# YSA - Yup Server Actions 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Yup](https://img.shields.io/badge/Yup-Validation-blueviolet)](https://github.com/jquense/yup)

A type-safe wrapper for React Server Actions with Yup schema validation.

## Features ✨

- 🛡️ **Type-safe**: Full TypeScript support with inferred types
- ✅ **Validation**: Seamless integration with Yup schemas
- 🧩 **Flexible**: Support for actions with or without input
- 🪝 **React Hook**: Easy integration with React components
- 📊 **Status Tracking**: Built-in state management for pending, success, and error states

## Installation 📦

```bash
npm install yup-server-action
# or
yarn add yup-server-action
# or
pnpm add yup-server-action
```

## Usage 📝

### Creating a Server Action with Input Validation

```typescript
// _action.ts
import { createServerAction } from "yup-server-action";
import * as y from "yup";

const UserSchema = y.object({
  name: y.string().required(),
  email: y.string().email().required(),
  password: y.string().required(),
});

export const saveUserAction = createServerAction()
  .input(UserSchema)
  .handle(async ({ input }) => {
    // Perform your server-side logic here
    // e.g., save to database, call external API, etc.
    
    return {
      user: input,
    };
  });
```

### Using the Server Action in a React Component

```tsx
// page.tsx
import React from "react";
import { useServerAction } from "yup-server-action";
import { saveUserAction } from "./_action";

export default function CreateUserPage() {
  const { execute, isPending, isSuccess, isError, error, data } =
    useServerAction(saveUserAction, {
      onSuccess(result) {
        alert("User created");
        console.log(result);
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
```

### Creating a Server Action without Input

```typescript
// _action.ts
import { createServerAction } from "yup-server-action";

export const getMyUserAction = createServerAction().handle(async () => {
  // Fetch user data or perform any server-side operation
  return {
    data: {
      // User data here
    },
  };
});
```

### Using a Server Action without Input

```tsx
// page.tsx
import React from "react";
import { useServerAction } from "yup-server-action";
import { getMyUserAction } from "./_action";

export default function UserProfilePage() {
  const { execute, isPending, isSuccess, isError, error, data } =
    useServerAction(getMyUserAction, {
      onSuccess(result) {
        console.log(result);
      },
    });

  if (isPending) {
    return <div>Loading user data...</div>;
  }

  if (isError) {
    return <div>Error loading user data</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <button onClick={() => execute()}>Load User Data</button>
      
      {isSuccess && (
        <div>
          <h2>User Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## API Reference 📚

### `createServerAction()`

Creates a new server action builder.

```typescript
// Without input schema
createServerAction().handle(handler)

// With input schema
createServerAction(schema).handle(handler)
// or
createServerAction().input(schema).handle(handler)
```

### `useServerAction(action, options?)`

React hook for using server actions in components.

```typescript
const {
  execute,   // Function to execute the server action
  isPending, // Boolean indicating if the action is in progress
  isSuccess, // Boolean indicating if the action completed successfully
  isError,   // Boolean indicating if the action resulted in an error
  data,      // The data returned by the action (if successful)
  error      // The error thrown by the action (if failed)
} = useServerAction(action, {
  onSuccess, // Optional callback for successful execution
  onError    // Optional callback for failed execution
});
```

## Why Use YSA? 🤔

- **Simplified Validation**: Leverage Yup's powerful schema validation without boilerplate
- **Type Safety**: Get full TypeScript support with inferred types from your schemas
- **React Integration**: Easily use server actions in your React components with built-in state management
- **Developer Experience**: Improve your DX with a clean, fluent API

## License 📄

[MIT](https://choosealicense.com/licenses/mit/)

## Author ✍️

Enzo Apolinário
