const Blockchain = require('./blockchain');
const Block = require('./block');
const {GENESIS_DATA} = require('./config');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });

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

    describe('isValidChain()', () => {

        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = {data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            })
        });

        describe('when the chain does start with the genesis block and has mutiple blocks', () => {

            beforeEach(() => {
                blockchain.addBlock({data: 'Bears'});
                blockchain.addBlock({data: 'Beats'});
                blockchain.addBlock({data: 'Office'});
            });

            describe('and a lasthash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken-lashHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'invalid-field-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            });

            describe('and the chain does not contain and invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                })
            })
        });
    });

    describe('replaceChain()', () => {

        let errorMock;
        let logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () => {

            beforeEach(() => {
                newChain.chain[0] = {new: 'chain'};
                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            });

        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({data: 'Bears'});
                newChain.addBlock({data: 'Beats'});
                newChain.addBlock({data: 'Office'});
            });
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'some-fake-hash';
                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain)
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', () => {

                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            })
        })
    })
});

