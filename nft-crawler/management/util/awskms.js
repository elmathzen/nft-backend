import Web3 from "web3";
import { KmsProvider } from "aws-kms-provider";

export const getEthWeb3 = function () {
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.SECRET_ACCESS_KEY;
    const region = process.env.REGION;
    const provider = new KmsProvider(process.env.ETH_NODE,
        {
            region, keyIds: [process.env.KEY_ID],
            credential: {
                accessKeyId
                , secretAccessKey
            }
        });

    return new Web3(provider);
}

export const getKlaytnWeb3 = function () {
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.SECRET_ACCESS_KEY;
    const region = process.env.REGION;
    const provider = new KmsProvider(process.env.KLAYTN_NODE,
        {region, keyIds: [process.env.KEY_ID], credential: {accessKeyId, secretAccessKey}});

    return new Web3(provider);
}