class Component{

	constructor(version, parentElement){
		this.version = version; // unique ID that is used to store data in database
		this.element;
		this.addTo(parentElement);
	}
	init(){
	}
	addTo(parentElement){
		const domParser = new DOMParser();
		this.element = domParser.parseFromString(this.html(), "text/html").body.firstChild;
		parentElement.appendChild(this.element)
	}
	html(){
		// Returns the HTML that renders this component
		return ``;
	}
}
export default Component;
