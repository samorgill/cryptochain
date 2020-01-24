const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-6ee1e6d6-0e43-4dce-9860-21cca5c2dc52',
    subscribeKey: 'sub-c-054919e2-3ebd-11ea-9443-9e82b35d3d47',
    secretKey: 'sec-c-NWNiYjY4ZGMtMjUzYi00YzA1LTgzYjItMzAyMzBlMjMyMGZk'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({blockchain}) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({channels: Object.values(CHANNELS)});
        this.pubnub.addListener(this.listener())
    }

    listener() {
        return {
            message: messageObject => {
                const {channel, message} = messageObject;
                console.log(`message received. Channel: ${channel}. Message: ${message}`);

                const parsedMessage = JSON.parse(message);

                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        }
    }

    publish({channel, message}) {
        this.pubnub.unsubscribe((channel, () => {
            this.pubnub.publish({channel, message}, () => {
                this.pubnub.subscribe({channels: Object.values(CHANNELS)});
            });
        }));
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;


