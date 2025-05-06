import * as yup from "yup";

type MaybePromise<T> = T | Promise<T>;
type NoInput = undefined;

type ServerActionHandlerContext<TInput> = TInput extends NoInput
  ? {}
  : { input: TInput };

type ServerActionHandler<TInput, TResult> = (
  ctx: ServerActionHandlerContext<TInput>
) => MaybePromise<TResult>;

// ✅ Atualizado para incluir TResult
export type ServerAction<TInput, TResult = any> = {
  _inputType: TInput;
  _resultType: TResult; // Apenas para inferência, não será usado
  run: (rawInput: TInput extends undefined ? void : TInput) => Promise<TResult>;
};

type ServerActionBuilderWithoutInput = {
  input<TNewInputSchema extends yup.ObjectSchema<Record<string, unknown>>>(
    schema: TNewInputSchema
  ): ServerActionBuilderWithInput<yup.InferType<TNewInputSchema>>;

  handle<TResult>(
    fn: ServerActionHandler<NoInput, TResult>
  ): ServerAction<undefined, TResult>;
};

type ServerActionBuilderWithInput<TInput> = {
  handle<TResult>(
    fn: ServerActionHandler<TInput, TResult>
  ): ServerAction<TInput, TResult>;
};

function internalBuilder<TInput>(
  inputSchema?: yup.ObjectSchema<Record<string, unknown>>
): TInput extends NoInput
  ? ServerActionBuilderWithoutInput
  : ServerActionBuilderWithInput<TInput> {
  const obj: any = {
    input<TNewInputSchema extends yup.ObjectSchema<Record<string, unknown>>>(
      schema: TNewInputSchema
    ) {
      return internalBuilder<yup.InferType<TNewInputSchema>>(schema);
    },

    handle<TResult>(
      fn: ServerActionHandler<any, TResult>
    ): ServerAction<any, TResult> {
      return {
        _inputType: undefined as any,
        _resultType: undefined as any,
        run: async (rawInput: unknown) => {
          const parsedInput = inputSchema
            ? await inputSchema.validate(rawInput, { abortEarly: false })
            : undefined;

          const ctx = inputSchema ? { input: parsedInput } : {};
          return fn(ctx);
        },
      };
    },
  };

  return obj;
}

export function createServerAction(): ServerActionBuilderWithoutInput;

export function createServerAction<
  TSchema extends yup.ObjectSchema<Record<string, unknown>>
>(schema: TSchema): ServerActionBuilderWithInput<yup.InferType<TSchema>>;

export function createServerAction(
  schema?: yup.ObjectSchema<Record<string, unknown>>
) {
  return schema ? internalBuilder(schema) : internalBuilder<NoInput>();
}
