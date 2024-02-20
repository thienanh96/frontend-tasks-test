type AsyncFunction<T, U> = (value: T) => Promise<U>;

async function map<T, U>(
  values: T[],
  asyncFn: AsyncFunction<T, U>,
  parallelLimit: number
): Promise<Array<U>> {
  const results: U[] = [];
  const executing: Promise<void>[] = [];

  async function processItem(item: T, index: number): Promise<void> {
    const result = await asyncFn(item);
    results[index] = result;
  }

  for (let i = 0; i < values.length; i++) {
    const processingPromise = processItem(values[i], i);

    // Push the cleanup operation to the executing array.
    executing.push(
      processingPromise.then(() => {
        // Once a promise completes, remove it from the executing array.
        executing.splice(executing.indexOf(processingPromise), 1);
      })
    );

    // If we reach the parallelLimit, wait for one of the promises to finish.
    if (executing.length >= parallelLimit) {
      await Promise.race(executing);
    }
  }

  // Wait for all remaining promises to finish.
  await Promise.all(executing);

  return results;
}

export default map;
