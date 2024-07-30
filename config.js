const host = 'http://192.168.19.180:3000';
const payProductIds = ['whisper.chat.app'];

const CONFIG = {
	dev: {
		host: 'http://192.168.19.180:3000',
		payProductIds: ['whisper.chat.app'],
		verifyReceiptUrl: 'https://sandbox.itunes.apple.com/verifyReceipt'
	},
	prod: {
		host: 'http://192.168.19.180:3000',
		payProductIds: ['whisper.chat.app'],
		verifyReceiptUrl: 'https://buy.itunes.apple.com/verifyReceipt'
	}
} 

// 环境变量
const config = CONFIG['dev'];

export  default config;