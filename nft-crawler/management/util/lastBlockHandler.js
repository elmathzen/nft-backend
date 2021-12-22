const models = require('../models');
const KLAYTN_CHAIN_NAME = 'nft';
const ETH_CHAIN_NAME = 'ropsten';
const KLAYTN_LAST_BLOCK = 73325953;
const ETH_LAST_BLOCK = 11277800;

module.exports = {
    selectETHLastBlockNumber: async function () {
        const rslt = await models.LastBlock.findByName(ETH_CHAIN_NAME);
        if (rslt == null) {
            await models.LastBlock.create({name: ETH_CHAIN_NAME, number: ETH_LAST_BLOCK});
            return ETH_LAST_BLOCK;
        }
        return rslt.number;
    },
    selectKlaytnLastBlockNumber: async function () {
        const rslt = await models.LastBlock.findByName(KLAYTN_CHAIN_NAME);
        if (rslt == null) {
            await models.LastBlock.create({name: KLAYTN_CHAIN_NAME, number: KLAYTN_LAST_BLOCK});
            return KLAYTN_LAST_BLOCK;
        }
        return rslt.number;
    },
    updateKlaytnLastBlockNumber: async function (num) {
        if (!num) {
            return;
        }
        return await models.LastBlock.update({number: num}, {where: {name: KLAYTN_CHAIN_NAME}}).catch((e) => {
            console.log(e);
        });
    },
    updateETHLastBlockNumber: async function (num) {
        if (!num) {
            return;
        }
        return await models.LastBlock.update({number: num}, {where: {name: ETH_CHAIN_NAME}}).catch((e) => {
            console.log(e);
        });
    }
}