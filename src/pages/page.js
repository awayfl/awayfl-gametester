import Database from "../utils/database";

class Page{
	constructor(app){
		this.app = app;
	}
	init(){
		this.container = document.createElement('div');
		this.container.setAttribute('id', 'container');

		document.body.appendChild(this.container);
	}
}
export default Page;
