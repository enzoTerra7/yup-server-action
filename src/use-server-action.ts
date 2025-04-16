import { useState } from "react";
import type { ServerAction } from "./create-server-action";

type UseServerActionOptions<TResult> = {
  onSuccess?: (data: TResult) => void;
  onError?: (error: unknown) => void;
};

type UseServerActionReturn<TInput, TResult> = {
  execute: TInput extends undefined ? () => Promise<void> : (input: TInput) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: undefined | TResult;
  error: undefined | unknown;
};

export function useServerAction<TInput, TResult>(
  action: ServerAction<TInput>,
  options?: UseServerActionOptions<TResult>
): UseServerActionReturn<TInput, TResult> {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<undefined | TResult>(undefined);
  const [error, setError] = useState<undefined | unknown>(undefined);

  const execute = async (...args: TInput extends undefined ? [] : [TInput]): Promise<void> => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const result = await action.run(...(args as [TInput extends undefined ? void : TInput]));
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
    execute: execute as TInput extends undefined ? () => Promise<void> : (input: TInput) => Promise<void>,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  };
}
