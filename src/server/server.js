var express = require('express');
var path = require('path');
var solve = require('./solver.js').solve;
var app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.listen(8080, function () {
    console.log('listening on 8080');
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.post('/go', function (req, res) {
    var algo = req.body.algorithm;
    var points = req.body.data;
    if (points.length < 2) {
        res.status(400).json({
            type: 'error',
            errorMsg: 'Create at least two (2) points.'
        });
    }
    else if (algo == 'dp' && points.length > 15) {
        res.status(400).json({
            type: 'error',
            errorMsg: 'Dynamic Programming algorithm requires at most fifteen (15) points'
        });
    }
    else {
        if (algo != 'dp') {
            res.status(501).json({
                type: 'error',
                errorMsg: 'Not yet implemented'
            });
        }
        var order = solve(algo, points);
        res.status(200).json({
            data: order
        });
    }
});
