const Blockchain = require('./blockchain');
const Block = require('./block');
const {GENESIS_DATA} = require('./config');


describe('Blockchain', () => {
    const blockchain = new Blockchain();

    it('contains a new array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('should start with a genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('should add a block to the chain', () => {

        const newData = 'foo-data';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });
});
