import Croner, { CronOptions } from 'croner';
type FileOrFunction = string | (() => void);
declare let jobsId: string[];
export default function Cron(cronExpression: string | Date, param1?: FileOrFunction | CronOptions, param2?: FileOrFunction | CronOptions): Promise<{
    save: (id?: string) => Promise<string>;
    remove: (id: string) => Promise<string | undefined>;
    raw: Croner;
}>;
export { jobsId };
