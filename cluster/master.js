'use strict';

const os = require('os');
const cluster = require('cluster');

console.log('Start master:', process.pid);

const cpuCount = os.cpus().length;
const workers = [];

for (let i = 0; i < cpuCount; i++) {
    const worker = cluster.fork();
    console.log('Started worker:', worker.process.pid);
    workers.push(worker);
}

const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 8, 0, 11];
const result = [];

workers.forEach(worker => {

    worker.send({ task });

    worker.on('exit', code => {
        console.log('Worker exited:', worker.process.pid, code);
    });

    worker.on('message', message => {

        console.log('Message from worker', worker.process.pid);
        console.log(message);

        result.push(message.result);

        if (result.length === cpuCount) {
            process.exit(0);
        }
    });

    setTimeout(() => process.exit(1), 5000);
});