import bs58check from 'bs58check';
import secp256k1 from 'secp256k1';
import zcrypto from './crypto.js';
import { config } from './config.js';

/*
 * Makes a private key
 * @param {String} phrase (Password phrase)
 * @return {Sting} Private key
 */
function mkPrivKey(phrase) {
    
  return zcrypto.sha256(Buffer.from(phrase, 'utf-8'));
}

/*
 * Converts a private key to WIF format
 * @param {String} privKey (private key)
 * @param {boolean} toCompressed (Convert to WIF compressed key or nah)
 * @return {Sting} WIF format (uncompressed)
 */
function privKeyToWIF(privKey, toCompressed) {
  toCompressed = toCompressed || false;
  const wif = config.mainnet.wif;

  if (toCompressed) privKey = privKey + '01';

  return bs58check.encode(Buffer.from(wif + privKey, 'hex'));
}

/*
 * Returns private key's public Key
 * @param {String} privKey (private key)
 * @param {boolean} toCompressed (Convert to public key compressed key or nah)
 * @return {Sting} Public Key (default: uncompressed)
 */
function privKeyToPubKey(privKey, toCompressed) {
    toCompressed = toCompressed || false; // Si no se proporciona toCompressed, se establece en false
  
    const pkBuffer = Buffer.from(privKey, 'hex'); // Convierte la clave privada de formato hexadecimal a un buffer
    var publicKey = secp256k1.publicKeyCreate(pkBuffer, toCompressed); // Crea la clave pública a partir del buffer de la clave privada
    return publicKey.toString('hex'); // Devuelve la clave pública en formato hexadecimal
  }

/*
 * Given a WIF format pk, convert it back to the original pk
 * @param {String} privKey (private key)
 * @return {Sting} Public Key (uncompressed)
 */
function WIFToPrivKey(wifPk) {
  var og = bs58check.decode(wifPk, 'hex').toString('hex');
  og = og.substr(2, og.length); // remove WIF format ('80')

  // remove the '01' at the end to 'compress it' during WIF conversion
  if (og.length > 64) {
    og = og.substr(0, 64);
  }

  return og;
}

/*
 * Converts public key to zelcash address
 * @param {String} pubKey (public key)
 * @param {String} pubKeyHash (public key hash (optional, else use defaul))
 * @return {Sting} zelcash address
 */
function pubKeyToAddr(pubKey) {
    // Si no se proporciona pubKeyHash, se utiliza el valor por defecto de config.mainnet.pubKeyHash
    const pubKeyHash = config.mainnet.pubKeyHash;
    console.log("hola");
    

    // Si pubKey es un string que representa un array, conviértelo a un array de números
    if (typeof pubKey === 'string') {
        pubKey = pubKey.split(',').map(Number);
    }

    // Si pubKey es un array, conviértelo a una cadena hexadecimal
    if (Array.isArray(pubKey)) {
        pubKey = arrayToHex(pubKey);
    }

    // Verifica si pubKey es una cadena válida
    if (typeof pubKey !== 'string' || pubKey.trim() === '') {
        throw new Error('Invalid pubKey: pubKey must be a non-empty string.');
    }

    const buffer = Buffer.from(pubKey, "hex");

    // Verifica si el buffer está vacío
    if (buffer.length === 0) {
        throw new Error('Invalid pubKey: Buffer is empty. Please check the input.');
    }

    console.log('Buffer (hex):', buffer.toString('hex')); // Imprime el buffer en formato hexadecimal

    // Se calcula el hash160 del pubKey, que es una forma de hash que se utiliza comúnmente en criptografía
    const hash160 = zcrypto.hash160(buffer);
    console.log('Hash160 result:', hash160); // Imprime el resultado de hash160
  
    // Se codifica el pubKeyHash concatenado con el hash160 en formato base58 y se convierte a una cadena hexadecimal
    return bs58check.encode(Buffer.from(pubKeyHash + hash160, 'hex')).toString('hex');
}

function pubKeyToAddrGroestl(pubKey, pubKeyHash) {
  pubKeyHash = pubKeyHash || config.mainnet.pubKeyHash;

  const hash160 = zcrypto.hash160(Buffer.from(pubKey, 'hex'));
  return bs58check.encode(Buffer.from(pubKeyHash + hash160, 'hex')).toString('hex');
}

// Función para convertir un array de números a una cadena hexadecimal
function arrayToHex(arr) {
    return arr.map(num => num.toString(16).padStart(2, '0')).join('');
}

export {
  mkPrivKey,
  privKeyToWIF,
  privKeyToPubKey,
  pubKeyToAddr,
  pubKeyToAddrGroestl,
  WIFToPrivKey
};