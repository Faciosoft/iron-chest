import Cluster from './cluster'
import fs = require('fs');
import { v4 } from 'uuid';

export default class IronChest_Storage extends Cluster {
    private path: string = '';
    private contentPath: string = '';
    private config: any;

    public init(path: string): void {
        this.config = require(path + '/iron-chest.config.json')
        this.path = path;
        this.contentPath = this.path + "/~" + this.config.storage.name

        this.checkSetup()
        this.passPath(this.contentPath)
    }

    private checkSetup(): void {
        if(!fs.existsSync(this.path + '/storage.lock.json')) {
            fs.writeFileSync(this.path + '/storage.lock.json', `{"id":"${v4()}"}`)
        }
        
        if(!fs.existsSync(this.contentPath)) {
            fs.mkdirSync(this.contentPath)
        }

        if(!fs.existsSync(this.contentPath + "/.Type")) {
            fs.writeFileSync(this.contentPath + "/.Type", 'Faciosoft:IronChest Storage')
        }
    }
}

export { Cluster }