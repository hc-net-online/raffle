require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const RandomOrg = require('random-org');

server.use(bodyParser.json());

async function getRandom(max, n) {
    const randomizer = new RandomOrg({apiKey: process.env.apiKey});
    const result = await randomizer.generateIntegers({
        min: 0,
        max: max,
        n: n,
        replacement: false
    });
    return result.random.data;
}

server.post('/', (req, res) => {
    if (req.body) {
        const {prize_count, numerator, denominator, tickets} = req.body;
        if (
            prize_count
            && numerator
            && denominator
            && tickets
        ) {
            if (Array.isArray(tickets) && tickets.length) {
                const count = tickets.length;
                let winners_count = Math.ceil((tickets.length / denominator) * numerator);
                if (winners_count > prize_count) {
                    winners_count = prize_count;
                }

                return getRandom(count - 1, winners_count).then(data => {
                    let winners = [];
                    for (const i of data) {
                        winners.push(tickets[i]);
                    }
                    res.send(winners);
                    return null;
                }).catch(e => res.status(500).send(e).end());
            }
        }
    }
    res.status(404).end();
});

server.listen(5000, () => {
    console.log('Listening on Port 5000');
});