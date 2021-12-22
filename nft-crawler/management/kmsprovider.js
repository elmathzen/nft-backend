import Web3 from "web3";
import { KmsProvider } from "aws-kms-provider";

const region = "ap-northeast-2";
const keyId = "mrk-98b808bd8d214d6196ff7db76eccd0b3";
const accessKeyId = 'AKIAWMULCMHZNL62SX4E';
const secretAccessKey = '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';

const endpoint = "https://ropsten.infura.io/v3/adb9c847d7114ee7bf83995e8f22e098";
const to = "0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73";

async function main() {
    const provider = new KmsProvider(endpoint,
        { region, keyIds: [keyId], credential: {accessKeyId, secretAccessKey} });

    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);

    const receipt = await web3.eth.sendTransaction({
        from: accounts[0],
        to,
        value: web3.utils.toWei("0.00001", "ether"),
    });

    console.log(receipt);
}

main().catch((e) => console.error(e));
