const fileName = 'deviceId.txt'
const read = (callback: Function) => {
	try{
		plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
			// fs.root是根目录操作对象DirectoryEntry
			let rootDir = fs.root.toURL()  //通过此方法我们可获取存储在app私用环境下的相对跟路径。
			const filePath = rootDir + '/box/' + `${fileName}`;
			
			fs.root.getFile(filePath, {
				create: true
			}, (fileEntry) => {
				// 文件在手机中的路径
				fileEntry.file((file) => {
					var fileReader = new plus.io.FileReader();
					fileReader.readAsText(file, 'utf-8');
					fileReader.onloadend = (evt) => {
						var result = evt.target.result;
						callback && callback(result)
					}
				});
			});
		})
		
	}catch(e){
		//TODO handle the exception
		console.log('error', e)
	}
	
}

const write = (data: string) => {
	plus.io.requestFileSystem(
		plus.io.PUBLIC_DOCUMENTS, // 文件系统中的根目录
		fs => {
			let rootDir = fs.root.toURL()  //通过此方法我们可获取存储在app私用环境下的相对跟路径。
			const filePath = rootDir + '/box/' + `${fileName}`;
			// 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
			fs.root.getFile(filePath, {
				create: true // 文件不存在则创建
			}, fileEntry => {
				// 文件在手机中的路径
				fileEntry.createWriter(writer => {
					// 写入文件成功完成的回调函数
					writer.onwrite = (e) => {
						console.log("写入数据成功");
					};
					// 写入数据
					writer.write(data);
				})
			}, e => {
				console.log("getFile failed: " + e.message);
			});
		},
		e => {
			console.log(e.message);
		}
	);
}

export {
	read,
	write
}