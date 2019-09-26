import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';
// para cada um dos jobs se cria uma fila, e dentro da fila se armazena o bee, que é a instancia que
// se conecta com o redis, que consegue armazenar e recuperar valores  do banco de dados  e tambem o handle
// que processa a fila, recebe as variaveis de dentro do contexto dos emails, dos appointments.
const jobs = [CancellationMail];
class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];
            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}
export default new Queue();
