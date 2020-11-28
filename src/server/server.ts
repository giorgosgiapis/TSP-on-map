const express: any = require('express');
const path = require('path')
const { solve } = require('./solver.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../../src/public')));
app.use('/js', express.static(path.join(__dirname, '../public')));
app.use(express.json())

app.listen(PORT, () => {
    console.log('listening on 8080');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/public/index.html'));
});

app.post('/go', (req, res) => {
    let algo: string = req.body.algorithm;
    let points: Array<any> = req.body.data;
    if (points.length < 2) {
        res.status(400).json({
            type: 'error',
            errorMsg: 'Create at least two (2) points.'
        });
    } else if (algo == 'dp' && points.length > 15) {
        res.status(400).json({
            type: 'error',
            errorMsg: 'Dynamic Programming algorithm requires at most fifteen (15) points'
        });
    } else {
        if (algo != 'dp') {
            res.status(501).json({
                type: 'error',
                errorMsg: 'Not yet implemented'
            })
        } else {
            let order: google.maps.LatLng[] = solve(algo, points);
            res.status(200).json({
                data: order
            });
        }
    }
});
