import crypto from "crypto";
import getConfig from "next/config";


const { serverRuntimeConfig }= getConfig()



export function encryptToken(token:string): string{
        const key = crypto.createHash('sha256').update(serverRuntimeConfig.SECRET_KEY).digest();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedToken = cipher.update(token, 'utf8', 'hex');
        encryptedToken += cipher.final('hex');
        return iv.toString('hex') + ':' + encryptedToken;
    }
    
export function decryptToken(encryptedToken:string): string{
        const key = crypto.createHash('sha256').update(serverRuntimeConfig.SECRET_KEY).digest();
        const parts = encryptedToken.split(':');
        const iv = Buffer.from(parts.shift()!, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decryptedToken = decipher.update(parts.join(':'), 'hex', 'utf8');
        decryptedToken += decipher.final('utf8');
        return decryptedToken;
    }
