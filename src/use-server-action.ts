import { useState } from "react";
import type { ServerAction } from "./create-server-action";

type InferInput<T> = T extends ServerAction<infer Input, any> ? Input : never;
type InferResult<T> = T extends ServerAction<any, infer Result>
  ? Result
  : never;

type UseServerActionOptions<TAction extends ServerAction<any, any>> = {
  onSuccess?: (data: InferResult<TAction>) => void;
  onError?: (error: unknown) => void;
};

type UseServerActionReturn<TAction extends ServerAction<any, any>> = {
  execute: InferInput<TAction> extends undefined
    ? () => Promise<void>
    : (input: InferInput<TAction>) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: InferResult<TAction> | undefined;
  error: unknown | undefined;
};

export function useServerAction<TAction extends ServerAction<any, any>>(
  action: TAction,
  options?: UseServerActionOptions<TAction>
): UseServerActionReturn<TAction> {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<InferResult<TAction> | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  const execute = async (
    ...args: InferInput<TAction> extends undefined ? [] : [InferInput<TAction>]
  ): Promise<void> => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const result = await action.run(...(args as [InferInput<TAction>]));
      options?.onSuccess?.(result);
      setIsSuccess(true);
      setData(result);
    } catch (error) {
      options?.onError?.(error);
      setIsError(true);
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    execute: execute as UseServerActionReturn<TAction>["execute"],
    isPending,
    isSuccess,
    isError,
    data,
    error,
  };
}
