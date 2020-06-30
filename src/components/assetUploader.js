import Component from "./component";
import Database from "../utils/database";

class AssetUploader extends Component {

	static EVENT_UPLOAD_ASSET = 'uploadAssetEvent';

	constructor(instanceName, parentElement, app) {
		super(instanceName, parentElement);
		this.app = app;
		this.init();
	}
	init() {
		super.init();

		this.initAssetList();
		this.initUploadButton();

		document.addEventListener(AssetUploader.EVENT_UPLOAD_ASSET, this.initAssetList.bind(this));

	}
	initAssetList() {

		const list = this.element.querySelector('.layerManager');
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
		const fileData = Database.gameData.fileData;


		console.log(fileData);

		if (!fileData) return;

		fileData.forEach(asset => {
			const li = document.createElement('div');
			li.classList.add('listItem')

			const text = document.createElement('input');
			text.setAttribute('type', 'text');
			text.setAttribute('readonly', '');
			text.setAttribute('value', asset.fileName);
			li.appendChild(text);

			list.appendChild(li);

			const testButton = document.createElement('button');
			testButton.innerText = 'test avm';
			li.appendChild(testButton);
			this.setTestButtonFunctionality(testButton, 1);
		});

	}
	setTestButtonFunctionality(button, version){
		const cancelEvents = (e)=>{
			e.stopPropagation();
		}
		// make sure to block all the default sortableJS behaviour
		button.addEventListener('pointerdown', cancelEvents);
		button.addEventListener('mousedown', cancelEvents);
		button.addEventListener('mouseup', cancelEvents);

		button.addEventListener('click', (e)=>{
			const title = e.currentTarget.parentNode.querySelector('input').value;
			this.app.runSWFGame(title, version);
			cancelEvents(e);
		})
	}
	initUploadButton() {
		const uploadButton = this.element.querySelector('.upload');
		const self = this.element;
		uploadButton.addEventListener('change', async (e) => {
			await Database.uploadFiles(e.target.files);
			document.dispatchEvent(new Event(AssetUploader.EVENT_UPLOAD_ASSET));
		})

		uploadButton.addEventListener('dragenter', (e) => {
            e.preventDefault();
            self.classList.toggle('over', true);
		}, false)

        uploadButton.addEventListener('dragleave', (e) => {
            e.preventDefault();
            self.classList.toggle('over', false);
        }, false)

        uploadButton.addEventListener('dragover', (e) => {
            e.preventDefault();
        }, false)

        uploadButton.addEventListener('drop', async (e) => {
            e.preventDefault();
            self.classList.toggle('over', false);
			await Database.uploadFiles(e.dataTransfer.files);
			document.dispatchEvent(new Event(AssetUploader.EVENT_UPLOAD_ASSET));
        }, false);

	}
	html() {
		return /*html*/ `
		<div style="margin:20px;" class = "uploader">
			<label for="upload">Upload:</label>
			<input class="upload" type="file" data-multiple-caption="{count} files selected" multiple id="upload">
			<div>
			Assets:
			<div class="layerManager"></div>
			</div>
		</div>
		`;
	}
}
export default AssetUploader;
