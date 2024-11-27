import {
    mkPrivKey,
    privKeyToPubKey,
    pubKeyToAddr
} from "../lib/adress.js";


export const createPrivKey = async (req, res) =>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        const phrase = username + password;
        const compressed = req.body.compressed;


        const privKey = await mkPrivKey(phrase) 
        const pubKey = await privKeyToPubKey(privKey, compressed)
        const addr = await pubKeyToAddr(pubKey);
        
        res.status(200).send({
            status: "succeed",
            privateKey: privKey,
            publicKey: pubKey,
            address : addr
        })
    } catch (error) {
        res.status(560).send(error);
    }
}


