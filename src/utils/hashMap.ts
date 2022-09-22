function convertHashMapToArray<TData>(object: { [key: string]: TData }) {
  const array: TData[] = Object.values(object);

  return array;
}

function convertArrToHashMap<TInput, TData>(
  array: TInput[],
  key: keyof TInput
) {
  return array.reduce((a, item) => {
    return { ...a, [item[key] as unknown as string]: item };
  }, {}) as TData;
}

export { convertArrToHashMap, convertHashMapToArray };
