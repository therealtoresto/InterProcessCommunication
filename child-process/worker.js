'use strict';

console.log('Hello from worker', process.pid);

const calculations = item => item * 2;

process.on('message', message => {
    console.log('Message to worker', process.pid);
    console.log('from master:', message);

    const result = message.task.map(calculations);
    process.send({ result });
});