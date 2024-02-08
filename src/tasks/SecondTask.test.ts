import map from "./SecondTask";

describe("Second Task - map function", () => {
  it("Should always run as many async functions as permitted by the parallel limit", async () => {
    const values = [1, 2, 3, 4];
    const asyncFn = async (x: number) => {
      // time execution of [1,2,3,4] is accordingly [100ms, 200ms, 300ms, 400ms]
      await new Promise((resolve) => setTimeout(resolve, 100 * x));
      return x * 2;
    };
    const parallelLimit = 3;

    const startTime = Date.now();

    const result = await map(values, asyncFn, parallelLimit);

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    expect(result).toEqual([
      {
        data: 2,
        error: undefined,
      },
      {
        data: 4,
        error: undefined,
      },
      {
        data: 6,
        error: undefined,
      },
      {
        data: 8,
        error: undefined,
      },
    ]);

    /**
     * parallelLimit = 3 means [1,2,3] runs in parallel first, after 100ms the 1 done then 4 runs (in parallel with 2 and 3)
     * 4 takes 400ms to complete, in the meantime because it runs in parallel with [2,3] so [2,3] should be done as well
     * so the expected time is 100ms (the 1 takes) + 400ms (the [2,3,4] takes) = 500ms
     *
     */
    const expectedTime = 500;

    expect(executionTime).toBeLessThanOrEqual(expectedTime + 20);
  });

  it("Should execute async function with parallel limit", async () => {
    const values = [1, 2, 3, 4, 5];
    const asyncFn = async (x: number) => {
      // Simulate delay to mimic an asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 100));
      return x * 2;
    };
    const parallelLimit = 3;

    const startTime = Date.now();

    const result = await map(values, asyncFn, parallelLimit);

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // Ensure that the execution time is close to the expected time with parallel execution
    // The expected time is calculated based on the number of values and parallel limit
    const expectedTime = Math.ceil(values.length / parallelLimit) * 100; // Assuming each asyncFn takes 100ms

    expect(result).toEqual([
      {
        data: 2,
        error: undefined,
      },
      {
        data: 4,
        error: undefined,
      },
      {
        data: 6,
        error: undefined,
      },
      {
        data: 8,
        error: undefined,
      },
      {
        data: 10,
        error: undefined,
      },
    ]);
    expect(executionTime).toBeLessThanOrEqual(expectedTime + 20); // Allow some margin of error
  });

  it("Should work with non-integer values", async () => {
    const values = ["a", "b", "c", "d", "e"];
    const asyncFn = async (x: string) => x.toUpperCase();
    const parallelLimit = 2;
    const result = await map(values, asyncFn, parallelLimit);
    expect(result).toEqual([
      {
        data: "A",
        error: undefined,
      },
      {
        data: "B",
        error: undefined,
      },
      {
        data: "C",
        error: undefined,
      },
      {
        data: "D",
        error: undefined,
      },
      {
        data: "E",
        error: undefined,
      },
    ]);
  });

  it("Should handle empty array", async () => {
    const values: number[] = [];
    const asyncFn = async (x: number) => x * 2;
    const parallelLimit = 3;
    const result = await map(values, asyncFn, parallelLimit);
    expect(result).toEqual([]);
  });

  it("Should handle errors when async function throws errors", async () => {
    const values = [1, 2, 3, 4, 5];

    const asyncFn = async (x: number) => {
      if (x % 2 === 0) {
        throw new Error("Even number failed");
      }

      return x * 2;
    };
    const parallelLimit = 3;
    const result = await map(values, asyncFn, parallelLimit);
    expect(result).toEqual([
      {
        data: 2,
        error: undefined,
      },
      {
        data: undefined,
        error: new Error("Even number failed"),
      },
      {
        data: 6,
        error: undefined,
      },
      {
        data: undefined,
        error: new Error("Even number failed"),
      },
      {
        data: 10,
        error: undefined,
      },
    ]);
  });
});
