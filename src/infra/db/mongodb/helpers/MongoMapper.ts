
export class MongoMapper {
  public static mapCollectionId (document: any):any {
    const { _id, ...documentWithoutId } = document
    return { id: _id, ...documentWithoutId }
  }

  public static mapCollectionsIds (documents: any[]):any[] {
    if (!documents || !Array.isArray(documents)) return []
    return documents.map(MongoMapper.mapCollectionId)
  }
}
