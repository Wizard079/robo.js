import { Flashcore } from "robo.js";
import Cron, { jobsId } from "../index.js";
export default (async ()=>{
    for(const id in jobsId){
        const arg = await Flashcore.get(id);
        try {
            Cron(arg.cronExpression, arg.param1, arg.param2);
        } catch (e) {
            console.error(`Unable to load ${arg} `, e);
        }
    }
});
