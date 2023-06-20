import { resolve } from "path";
import { Encrypt } from "./encrypt";
import fs = require("fs")
import { Decrypt } from "./decrypt";

export default class Cluster {
    private clusterPath: string;
    private encryptionKey: string = '';

    constructor() {
        this.clusterPath = '/'
    }

    public passPath(path: string): void {
        this.clusterPath = resolve(path)
    }
    
    public useEncryptionKey(key: string) {
        this.encryptionKey = key
    }

    // ================== //
    // Cluster blockchain //
    // ================== //

    public getCluster(clusterName: string): Cluster|void {
        if(!clusterName || clusterName === "" || clusterName === " ") return;

        // Checking
        const requestedClusterPath   = resolve(this.clusterPath + '/' + clusterName)
        const requestedClusterConfig = resolve(requestedClusterPath + '/cluster.json')

        if(!fs.existsSync(requestedClusterConfig)) return;

        // Getting the instance
        const cluster = new Cluster()
        cluster.passPath(requestedClusterPath)

        return cluster
    }

    public createCluster(clusterName: string, encryption: string = ''): Cluster|void {
        if(!clusterName || clusterName === "" || clusterName === " ") return;

        // Checking
        const requestedClusterPath   = resolve(this.clusterPath + '/' + clusterName)
        const requestedClusterConfig = resolve(requestedClusterPath + '/cluster.json')

        if(this.getCluster(clusterName)) return this.getCluster(clusterName)

        // Creating cluster
        const data = Encrypt('{}', encryption)

        fs.mkdirSync(requestedClusterPath)
        fs.writeFileSync(requestedClusterConfig, data)

        // Getting the instance
        const cluster = new Cluster()
        cluster.passPath(requestedClusterPath)

        return cluster
    }

    // ================= //
    // File manipulation //
    // ================= //
    public fileExists(file: string): boolean {
        return fs.existsSync(this.clusterPath + "/" + file)
    }

    public fileNotExists(file: string): boolean {
        return !this.fileExists(file)
    }

    public fileWrite(file: string, buffer: string): void {
        fs.writeFileSync(this.clusterPath + "/" + file, Encrypt(buffer, this.encryptionKey))
    }

    public fileRead(file: string): any {
        return Decrypt(fs.readFileSync(this.clusterPath + "/" + file, 'utf-8'), this.encryptionKey)
    }

    public fileRemove(file: string): string {
        const content = this.fileRead(file)
        fs.unlinkSync(this.clusterPath + "/" + file)

        return content
    }

    public fileRename(file: string, newFile: string): void {
        fs.renameSync(this.clusterPath + "/" + file, newFile)
    }
}