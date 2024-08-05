---
order: 930
---

# useCronJob

This API allows you to create timed events that happen at different intervals based on server time. Such as every 5th minute of the hour, every hour, etc. 

Details on how to create the cron expression can be found in the node-cron documentation:

[Cron Syntax](https://www.npmjs.com/package/node-cron#cron-syntax)

## How to create new Cronjob

To create a new cron job, you need a unique name, a cron expression that defines the time of execution and one or more functions that are executed.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const cronJob = Rebar.useCronJob();

declare global {
    export interface CronJobs {
        'my-cronjob': {
            cronExpression: string;
            tasks: any[];
        };
    }
}

export function task1() {
    alt.log('Task 1');
}

cronJob.create('my-cronjob', '*/5 * * * * *', [task1]);
```

## How to remove a Cronjob

```ts
cronJob.remove('my-cronjob');
```

## How to add a function to an existing cronjob


```ts
export function task2() {
    alt.log('Task 2');
}

cronJob.addTaskToCron('my-cronjob', task2);
```

## How to remove a function to an existing cronjob


```ts
export function task2() {
    alt.log('Task 2');
}

cronJob.removeTaskFromCron('my-cronjob', task2);
```
