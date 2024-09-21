const net = require('net');

class Proxy {

    _pipeName = '\\\\.\\pipe\\MyPipe';

    _pipeMessageSuffix = '\n~~~~~~~~~~\n';

    /** @type {net.Server?} */
    _stream = null;

    /** @type {Function[]} */
    listeners = [];

    _createNetServer() {
        this._stream = net.createServer((stream) => {
            let data = '';

            setTimeout(() => console.log(data), 10000);

            stream.on('data',
                (chunk) => {
                    data += chunk;

                    // while(data.includes(this._pipeMessageSuffix)) {
                    //     const endIndex = data.indexOf(this._pipeMessageSuffix);
                    //     const nextIndex = endIndex + this._pipeMessageSuffix.length;
                    //     const message = data.substring(0, endIndex);
                    //     console.log({message});
                    //     data = data.substring(endIndex + nextIndex);
                    // }
                    
                }
            );

            stream.on('end', () => {
                console.log('Client disconnected');
            });

        });

        this._stream.listen(this._pipeName, () => {
            console.log(`Server listening on ${this._pipeName}`);
        });
    }

    _onMessage(data) {
        const packet = new EnetPacket(data);
        this.listeners.forEach(fn => fn(packet));
    }

    addMessageListener(cb) {

        if (this._stream === null) this._createNetServer();

        if (typeof cb !== 'function') throw new Error(`'cb' is not a function, received ${typeof cb} instead`);

        this.listeners.push(cb);

    }

}

class EnetPacket {

    /** @type {boolean} */
    incoming

    /** @type {number} */
    type;

    /** @type {number} */
    referenceCount;

    /** @type {number} */
    flags;

    /** @type {number} */
    dataLength;

    /** @type {string} */
    data;

    /**
     * @param {string} packetStr 
     */
    constructor(packetStr) {

        const incoming_key = '"incoming":"';
        const type_key = '"type":';
        const referenceCount_key = ',"referenceCount":"';
        const flags_key = '","flags":"';
        const dataLength_key = ',"dataLength":"';
        const data_key = ',"data":"';

        packetStr = packetStr.substring(packetStr.indexOf(incoming_key) + incoming_key.length);

        const incoming = packetStr.substring(0, packetStr.indexOf(type_key));
        this.incoming = incoming === 'true';

        packetStr = packetStr.substring(packetStr.indexOf(type_key) + type_key.length);

        const type = packetStr.substring(0, packetStr.indexOf(referenceCount_key));
        this.type = parseInt(type);

        packetStr = packetStr.substring(packetStr.indexOf(referenceCount_key) + referenceCount_key.length);

        const referenceCount = packetStr.substring(0, packetStr.indexOf(flags_key));
        this.referenceCount = parseInt(referenceCount);

        packetStr = packetStr.substring(packetStr.indexOf(flags_key) + flags_key.length);

        const flags = packetStr.substring(0, packetStr.indexOf(dataLength_key));
        this.flags = parseInt(flags);

        packetStr = packetStr.substring(packetStr.indexOf(dataLength_key) + dataLength_key.length);

        const dataLength = packetStr.substring(0, packetStr.indexOf(data_key));
        this.dataLength = parseInt(dataLength);

        this.data = packetStr.substring(packetStr.indexOf(data_key) + data_key.length, packetStr.length - 2);

    }

}

module.exports = new Proxy();