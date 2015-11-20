var LineByLineReader = require('line-by-line');

module.exports = function(RED) {
    function LineByLineNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {

            var filePath = config.filepath || msg.payload;

            var lr = new LineByLineReader(filePath),
                count = 0;

            node.status({fill:"green",shape:"ring",text: 'Started'});

            var updateInterval = setInterval(function(){
                node.status({fill:"green",shape:"ring",text: count + ' records'});
            }, 5000);

            lr.on('error', function (err) {
                // 'err' contains error object
                node.error(err);
                node.status({fill:"red",shape:"dot",text: "Error reading the file"});
            });

            lr.on('line', function (line) {

                msg.payload = line;
                node.send(msg);
                count++;
            });

            lr.on('end', function () {
                // All lines are read, file is closed now.
                clearInterval(updateInterval);
                node.status({fill:"green",shape:"dot",text: "All lines read"});
            });

        });
    }
    RED.nodes.registerType("line-by-line",LineByLineNode);
};