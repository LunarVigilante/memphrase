import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';

const cryptocurrencies = [
    { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qt7nup0f8fuu54pwv5u2ngpy85pdhxly9wat2r0', qrImagePath: '/qr-code-btc.png' },
    { name: 'Ethereum', symbol: 'ETH', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-eth.png' },
    { name: 'BNB (SmartChain)', symbol: 'BNB', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-bnb.png' },
    { name: 'USDC (Polygon)', symbol: 'USDC', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-usdc-polygon.png' },
    { name: 'USDT (Tron)', symbol: 'USDT', address: 'TAWPxf48E4gypFcfCHP7gqFaJFsztXQSEC', qrImagePath: '/qr-code-usdt-tron.png' },
    { name: 'MATIC (Polygon)', symbol: 'MATIC', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-matic.png' },
    { name: 'Litecoin', symbol: 'LTC', address: 'ltc1q4gms5ghpdxz07a544w35cere53k30qxamrjhsu', qrImagePath: '/qr-code-ltc.png' },
    { name: 'Dogecoin', symbol: 'DOGE', address: 'D5RuDLZB4MBZaLkMdS4QTZCrFPN2FbHG9K', qrImagePath: '/qr-code-doge.png' },
    { name: 'Monero', symbol: 'XMR', address: '4AXmDVDpdGCQE8YVG9FTAN8MgHxbur6SxbmtgeCKESZaDGdxsYm1rkT3QyUpcYHypNRiPLWYjJpL9TUxXi9kp7oL2j5W1kS', qrImagePath: '/qr-code-xmr.png' },
    { name: 'Polkadot', symbol: 'DOT', address: '12utevfZWm1vkZpEZPpDod3mJffRMWZP8FT4FTDt1X2HXg8A', qrImagePath: '/qr-code-dot.png' }
];

const staticDir = 'static';
const currentDir = process.cwd(); // Get the current working directory
const staticDirPath = path.join(currentDir, staticDir);

async function generateQRCodes() {
    if (!fs.existsSync(staticDirPath)) {
        console.log(`Creating directory: ${staticDirPath}`);
        fs.mkdirSync(staticDirPath, { recursive: true });
    }

    for (const crypto of cryptocurrencies) {
        // Remove leading slash from qrImagePath if it exists, as path.join handles it
        const imageName = crypto.qrImagePath.startsWith('/') ? crypto.qrImagePath.substring(1) : crypto.qrImagePath;
        const outputPath = path.join(staticDirPath, imageName);
        
        try {
            await QRCode.toFile(outputPath, crypto.address, {
                errorCorrectionLevel: 'H', // High error correction
                margin: 2, // Margin around the QR code
                width: 288 // Width of the QR code image in pixels
            });
            console.log(`Successfully generated QR code for ${crypto.name} at ${outputPath}`);
        } catch (err) {
            console.error(`Error generating QR code for ${crypto.name}:`, err);
        }
    }
}

generateQRCodes(); 