function normalisePath(path: string) {
  return path.replace("%2F", "/");
}

export { normalisePath };
