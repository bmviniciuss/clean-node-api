import { MongoClient, Collection } from 'mongodb'

export class MongoConnectionSingleton {
  private static client: MongoClient;
  private static mongoHelperInstance: MongoConnectionSingleton;
  private static uri: string;

  private constructor () {}

  public static getInstance ():MongoConnectionSingleton {
    if (!MongoConnectionSingleton.mongoHelperInstance) {
      return new MongoConnectionSingleton()
    }
    return MongoConnectionSingleton.mongoHelperInstance
  }

  public async connect (uri: string):Promise<void> {
    MongoConnectionSingleton.uri = uri
    MongoConnectionSingleton.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  public async disconnect (): Promise<void> {
    await MongoConnectionSingleton.client.close()
    MongoConnectionSingleton.client = null
  }

  private _isConnected (): boolean {
    if (MongoConnectionSingleton.client) {
      return MongoConnectionSingleton.client.isConnected()
    }
    return false
  }

  public async getCollection (collectionName: string): Promise<Collection> {
    if (!this._isConnected()) {
      await this.connect(MongoConnectionSingleton.uri)
    }
    return MongoConnectionSingleton.client.db().collection(collectionName)
  }
}
