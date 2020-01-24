const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-6ee1e6d6-0e43-4dce-9860-21cca5c2dc52',
    subscribeKey: 'sub-c-054919e2-3ebd-11ea-9443-9e82b35d3d47',
    secretKey: 'sec-c-NWNiYjY4ZGMtMjUzYi00YzA1LTgzYjItMzAyMzBlMjMyMGZk'
};

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({channels: Object.values(CHANNELS)});
        this.pubnub.addListener(this.listener())
    }

    listener() {
        return {
            message: messageObject => {
                const {channel, message} = messageObject;
                console.log(`message received. Channel: ${channel}. Message: ${message}`);
            }
        }
    }

    publish({channel, message}) {
        this.pubnub.publish({channel, message});
    }
}

module.exports = PubSub;


