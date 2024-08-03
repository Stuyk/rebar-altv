import cron from 'node-cron';

declare global {
    export interface CronJobs {}
}

const registeredJobs = new Map<string, { job: cron.ScheduledTask, cronExpression: string, tasks: (() => void)[] }>();

export function useCronJob() {
    function create(jobName: string, cronExpression: string, tasks: (() => void)[], overwrite = false): boolean {
        if (!cron.validate(cronExpression)) {
            return false;
        }

        if (registeredJobs.has(jobName)) {
            if (!overwrite) {
                return false;
            }
            const { job } = registeredJobs.get(jobName);
            job.stop();
            registeredJobs.delete(jobName);
        }

        const job = cron.schedule(cronExpression, () => {
            tasks.forEach(task => task());
        });

        registeredJobs.set(jobName, { job, cronExpression, tasks });

        return true;
    }

    function remove(jobName: string) {
        if (!registeredJobs.has(jobName)) {
            return;
        }
        
        const { job } = registeredJobs.get(jobName);
        job.stop();
        registeredJobs.delete(jobName);
    }

    function addTaskToCron<K extends keyof CronJobs>(jobName: K, task: () => void) {
        if (!registeredJobs.has(jobName)) {
            return;
        }
        
        const { job, cronExpression, tasks } = registeredJobs.get(jobName);
        job.stop();

        tasks.push(task);
        create(jobName, cronExpression, tasks, true);
    }

    function removeTaskFromCron<K extends keyof CronJobs>(jobName: K, task: () => void) {
        if (!registeredJobs.has(jobName)) {
            return;
        }
        
        const { job, cronExpression, tasks } = registeredJobs.get(jobName);
        job.stop();

        const index = tasks.indexOf(task);
        if (index > -1) {
            tasks.splice(index, 1);
        }

        create(jobName, cronExpression, tasks, true);
    }

    return {
        create,
        addTaskToCron,
        removeTaskFromCron,
        remove
    };
}
