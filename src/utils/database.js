import PouchDB from 'pouchdb'

const db = new PouchDB('template_maker');

class DatabaseSingleton{
	constructor(){
		this.gameSlug;
		this.gameData;
	}
	async load(gameSlug){
        this.gameSlug = gameSlug;
        this.gameData = await this.getOrPut(this.gameSlug);
        return this.gameData;
	}

	async uploadFiles(files){
			let docRev;
			let newData = [];
			let allowedFileTypes = ['swf'];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const fileType = file.name.split('.').pop();
				if(!allowedFileTypes.includes(fileType)){
					alert(`only files of type ${allowedFileTypes.toString()} are allowed`);
					return;
				}
				console.log(file);
				newData.push({
					fileName: file.name,
					type:'default',
					size:file.size
				})
				docRev = await this.getOrPut(this.gameSlug);
				await db.putAttachment(this.gameSlug, file.name, docRev._rev, file, file.type);
			}
			docRev = await this.getOrPut(this.gameSlug);

			if(docRev.fileData == undefined) docRev.fileData = [];

			const newDataFileNameDictionary = newData.reduce((map, item)=>{map[item.fileName]=item;return map}, {});


			newData = newData.concat(docRev.fileData.filter((item) => !newDataFileNameDictionary[item.fileName]));
			docRev.fileData = newData;

			await db.put(docRev);
			this.gameData = await db.get(this.gameSlug);
			return this.gameData;
	}
	async getSWFBloblURL(fileName){
		const blob = await db.getAttachment(this.gameSlug, fileName)
		return URL.createObjectURL(blob);
	}
	async getSWFData(fileName){
		const swf = await this.getSWFBloblURL(fileName);
		this.gameData = await db.get(this.gameSlug);

		const fileData = this.gameData.fileData.find(element => element.fileName == fileName);
		return {name:fileName, swf, swf_size:fileData.size}
	}
	async getOrPut(id){
		try {
			return await db.get(id);
		} catch (error) {
			if (error.status === 404) return await db.put({
				_id: id
			});
			return error;
		}
	}
}
const Database = new DatabaseSingleton();
export default Database;





