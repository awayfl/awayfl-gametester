import Component from "./component";

class AVMTester extends Component {
    constructor(version, parentElement, data) {
        super(version, parentElement);
		this.init();
		this.data = data;
	}
	async init() {
		super.init();
		this.iframe = this.element.querySelector('iframe');
		this.iframe.onload = ()=>{this.sendData(this.data.name, this.data.swf, this.data.swf_size)};
	}
	sendData(name, swf, swf_size){
		const span = this.element.querySelector('span');
		span.innerText = span.innerText.replace('...loading', `loaded game ${this.data.name}`);
		this.iframe.contentWindow.postMessage({type:"sendSwfData", swf:{name, swf, swf_size}});
	}
	html(){
		return `
		<div style="display:grid;">
		<span>AVM${this.version} ...loading</span>
		<iframe style="width:550px;height:450px"src="./avms/avm.html"></iframe>
		</div>
		`;
	}
}
export default AVMTester;
