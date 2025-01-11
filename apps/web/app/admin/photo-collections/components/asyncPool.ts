export default async function asyncPool<T, U>(
    concurrencyLimit: number,
    items: T[],
    asyncTask: (item: T) => Promise<U>
  ): Promise<U[]> {
    const tasks: Promise<U>[] = [];
    const pendings: Promise<U>[] = [];
  
    for (const item of items) {
      const task = asyncTask(item);
      tasks.push(task);
  
      if (concurrencyLimit <= items.length) {
        task.then(() => {
          pendings.splice(pendings.indexOf(task), 1);
        });
        pendings.push(task);
  
        if (pendings.length >= concurrencyLimit) {
          await Promise.race(pendings);
        }
      }
    }
  
    return Promise.all(tasks);
  }