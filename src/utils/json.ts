function parse<TData>(value: string) {
  return JSON.parse(value) as TData;
}

function stringify(data: any) {
  return JSON.stringify(data);
}

export { parse, stringify };
