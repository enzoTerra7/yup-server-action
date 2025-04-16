import * as yup from 'yup';

type MaybePromise<T> = T | Promise<T>;
type NoInput = undefined;

// Contexto passado pra função handle
type ServerActionHandlerContext<TInput> = TInput extends NoInput ? {} : { input: TInput };

// Função handler com ou sem input
type ServerActionHandler<TInput, TResult> = (
  ctx: ServerActionHandlerContext<TInput>
) => MaybePromise<TResult>;

// Tipo retornado pela action para uso com `useServerAction`
export type ServerAction<TInput> = {
  _inputType: TInput;
  run: (rawInput: TInput extends undefined ? void : TInput) => Promise<any>;
};

// Builder quando input ainda não foi definido
type ServerActionBuilderWithoutInput = {
  input<TNewInputSchema extends yup.ObjectSchema<Record<string, unknown>>>(
    schema: TNewInputSchema
  ): ServerActionBuilderWithInput<yup.InferType<TNewInputSchema>>;

  handle<TResult>(
    fn: ServerActionHandler<NoInput, TResult>
  ): ServerAction<undefined>;
};

// Builder com input definido
type ServerActionBuilderWithInput<TInput> = {
  handle<TResult>(
    fn: ServerActionHandler<TInput, TResult>
  ): ServerAction<TInput>;
};

// Builder interno
function internalBuilder<TInput>(
  inputSchema?: yup.ObjectSchema<Record<string, unknown>>
): TInput extends NoInput ? ServerActionBuilderWithoutInput : ServerActionBuilderWithInput<TInput> {
  const obj: any = {
    input<TNewInputSchema extends yup.ObjectSchema<Record<string, unknown>>>(schema: TNewInputSchema) {
      return internalBuilder<yup.InferType<TNewInputSchema>>(schema);
    },

    handle(fn: ServerActionHandler<any, any>): ServerAction<any> {
      return {
        _inputType: undefined as any,
        run: async (rawInput: unknown) => {
          const parsedInput = inputSchema
            ? await inputSchema.validate(rawInput, { abortEarly: false })
            : undefined;

          const ctx = inputSchema ? { input: parsedInput } : {};
          return fn(ctx);
        }
      };
    }
  };

  return obj;
}

// Função principal com overloads
export function createServerAction(): ServerActionBuilderWithoutInput;

export function createServerAction<TSchema extends yup.ObjectSchema<Record<string, unknown>>>(
  schema: TSchema
): ServerActionBuilderWithInput<yup.InferType<TSchema>>;

export function createServerAction(schema?: yup.ObjectSchema<Record<string, unknown>>) {
  return schema ? internalBuilder(schema) : internalBuilder<NoInput>();
}
