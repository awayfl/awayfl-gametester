import Component from "./component";
import { Sortable, MultiDrag } from 'sortablejs';
import Database from "../utils/database";
import globals from "../utils/globals";

Sortable.mount(new MultiDrag());



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
			testButton.innerText = 'test avm1';
			li.appendChild(testButton);
			this.setTestButtonFunctionality(testButton, 1);

			const testButton2 = document.createElement('button');
			testButton2.innerText = 'test avm2';
			li.appendChild(testButton2);
			this.setTestButtonFunctionality(testButton2, 2);

		});

		Sortable.create(list, {
			group: {
				name: globals.SORTABLE_GROUP_LAYER,
				pull: 'clone',
				put: false,
				revertClone: true
			},
			sort: false,
			forceFallback: true,
			multiDrag: true,
			selectedClass: 'sortablejs-selected',
			onEnd:(e)=>{
				const clones = e.clones.length > 0 ? e.clones : [e.clone];
				clones.forEach((clone)=>{
					const button = clone.querySelector('button');
					this.setTestButtonFunctionality(button);
				});
			},
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
		uploadButton.addEventListener('change', async (e) => {
			await Database.uploadFiles(e.target.files);
			document.dispatchEvent(new Event(AssetUploader.EVENT_UPLOAD_ASSET));
		})
	}
	html() {
		return /*html*/ `
		<div style="margin:20px;">
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
