type AsyncFunction<T, U> = (value: T) => Promise<U>;

type Task = {
  index: number;
  done?: boolean;
};

function map<T, U>(
  values: T[],
  asyncFn: AsyncFunction<T, U>,
  parallelLimit: number
): Promise<Array<{ data?: U; error?: Error }>> {
  const results: { data?: U; error?: Error }[] = [];

  const queuedTasks: Task[] = arrayRange(parallelLimit, values.length - 1).map(
    (index) => ({
      index,
    })
  );

  const executingTasks: Task[] = [];

  const asyncFnCb = (index: number, data?: U, error?: Error) => {
    const currentIndex = executingTasks.findIndex((e) => e.index === index);

    if (currentIndex !== -1) {
      executingTasks[currentIndex].done = true;
    }

    results[index] = {
      data,
      error,
    };

    if (
      queuedTasks.length > 0 &&
      executingTasks.filter((e) => !e.done).length < parallelLimit
    ) {
      const queuedTask = queuedTasks.shift()!;
      callAsyncFn(queuedTask.index);
    }
  };

  const callAsyncFn = (index: number) => {
    executingTasks.push({ index });
    asyncFn(values[index])
      .then((result) => {
        asyncFnCb(index, result);
      })
      .catch((error: Error) => {
        asyncFnCb(index, undefined, error);
      });
  };

  arrayRange(0, Math.min(parallelLimit - 1, values.length - 1)).map((index) =>
    callAsyncFn(index)
  );

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (executingTasks.every((e) => e.done)) {
        clearInterval(interval);
        resolve(results);
      }
    }, 1);
  });
}

const arrayRange = (start: number, stop: number) =>
  start > stop
    ? []
    : Array.from({ length: stop - start + 1 }, (_, index) => start + index);

export default map;
