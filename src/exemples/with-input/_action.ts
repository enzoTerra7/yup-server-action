import { createServerAction } from "create-server-action";
import * as y from "yup";

const UserSchema = y.object({
  name: y.string().required(),
  email: y.string().email().required(),
  password: y.string().required(),
});

export const saveUserAction = createServerAction()
  .input(UserSchema)
  .handle(async ({ input }) => {
    // make your mutation here

    return {
      user: input,
    };
  });
