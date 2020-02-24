import Page from "./page";
import AssetUploader from "../components/assetUploader";
import AVMTester from "../components/avmtester";
import Database from "../utils/database";

class UploadPage extends Page {
    constructor(app) {
		super(app);
		this.init();

		this.avmFrame;
	}
	async init(){
		super.init();
		const assetUploader = new AssetUploader('assets', this.container, this);
	}
	async runSWFGame(title, version){
		if(this.avmFrame){
			this.avmFrame.element.parentNode.removeChild(this.avmFrame.element);
		}

		const data = await Database.getSWFData(title);
		this.avmFrame = new AVMTester(version, this.container, data);
	}
}
export default UploadPage;
