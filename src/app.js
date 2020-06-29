import UploadPage from "./pages/uploadPage";
import Database from "./utils/database";

class App {
    constructor() {
        this.init();
    }
    async init() {
        const dbName = 'awayjs-gametester';
        this.loadDB(dbName);
    }

    async loadDB(name){
        if(this.currentEditor) this.currentEditor.container.parentNode.removeChild(this.currentEditor.container);
        const data = await Database.load(name);
        this.editorPages = [UploadPage];
        this.currentEditor = new this.editorPages[0](this);
    }

    nextScreen(){
    }
    previousScreen(){

    }
}

const app = new App();
