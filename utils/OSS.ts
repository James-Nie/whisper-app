import {getSingature} from '@/server/index';

const modules = {
	useravatar: 'upload/useravatar'
}

function upload(options: any) {
	const {fileType, fileLocalPath, module, success, fail} = options
	getSingature({ fileType }, (res: any) => {
		const { host, expire, policy, signature, accessId, dir } = res.data;
		
		let ossDir = 'upload/' + dir
		if(modules[module]) {
			ossDir = modules[module]
		}
		const fileName = getFileName(fileLocalPath);
		
		const filePath =  ossDir + '/' + fileName;
		const requestFilePath = host + '/' + filePath;
		
		uni.uploadFile({
			url: host,
			filePath: fileLocalPath,
			name: 'file',
			formData: {
				key: filePath,
				policy,
				OSSAccessKeyId: accessId,
				success_action_status: '200',
				signature
			},
			success: (res) => {
				success && success(res, requestFilePath)
				
			},
			fail: (err) => {
				console.log('upload fail', err);
				fail && fail(err)
				
			}
		});

	})
}

function _getSuffix(filename : string) {
	let pos = filename.lastIndexOf('.');
	let suffix = '';
	if (pos != -1) {
		suffix = filename.substring(pos);
	}
	return suffix;
}

function getFileName(filename : string) {
	return (
		new Date().getTime() + Math.random().toString(36).substring(3, 20) + _getSuffix(filename)
	);
}

export {
	upload,
	getFileName
}