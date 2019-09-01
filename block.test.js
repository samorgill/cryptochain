const Block = require('./block');
const {GENESIS_DATA} = require('./config');

describe('Block', () => {
    const timestamp = 'a date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const block = new Block({timestamp, lastHash, hash, data});

    it('has a timestamp, lastHash, hash & data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);

    });

    it('Creates the first genesis block', () => {
        const genesisBlock = Block.genesis();

        expect(genesisBlock instanceof Block).toBe(true);

        expect(genesisBlock).toEqual(GENESIS_DATA);
    })
});
