import { createServerAction } from "create-server-action";

export const getMyUserAction = createServerAction().handle(async () => {
  return {
    data: {},
  };
});
