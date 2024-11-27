/* 
 * Obtained from https://github.com/TheTrunk/bitcoinjs-lib/blob/master/src/crypto.js
 * 2017/07/25: No ripemd160 in SJCL, so resorted to this
 */

import createHash from 'create-hash';
import groestlhash from '@runonflux/groestl-hash-js';

export function ripemd160(buffer) {
  try {
    return createHash('ripemd160')
      .update(buffer)
      .digest('hex');
  } catch (err) {
    return createHash('rmd160')
      .update(buffer)
      .digest('hex');
  }
}

export function sha1(buffer) {
  return createHash('sha1').update(buffer).digest('hex');
}

export function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

export function sha256x2(buffer) {
  return sha256(Buffer.from(sha256(buffer), 'hex'));
}

export function hash160(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Expected a buffer');
  }
  console.log('Input buffer:', buffer.buffer);
  const sha = sha256(buffer);
  console.log('SHA256 result:', sha);
  const hash160 = ripemd160(Buffer.from(sha, 'hex'));
  console.log('RIPEMD160 result:', hash160);
  return hash160;
}

export function groestl(buffer) {
  return Buffer(groestlhash.groestl_2(buffer, 1, 1));
}

export default {
  hash160,
  ripemd160,
  sha1,
  sha256,
  sha256x2,
  groestl
};