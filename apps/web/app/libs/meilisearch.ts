
import { Index, MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILISEARCH_API_KEY
})

export { client as meilisearch }

let photoCollectionIndex: Index | null = null;
export const getPhotoCollectionIndex = async () => {
    if (photoCollectionIndex) return photoCollectionIndex;
    try {
        const indexes = await client.getIndexes()
        const exists = indexes.results.some(index => index.uid === 'photo-collections')

        if (!exists) {
            await client.createIndex('photo-collections', {
                primaryKey: 'id'
            })
            photoCollectionIndex = client.index('photo-collections')
            await photoCollectionIndex.updateDisplayedAttributes(['id', 'imageCount', 'uuid', 'cover', 'title', 'subtitle', 'tags', 'recommend','status', 'description','updatedAt'])
            await photoCollectionIndex.updateFilterableAttributes(['id', 'imageCount', 'uuid', 'cover', 'title', 'subtitle', 'tags', 'recommend', 'status', 'description','updatedAt'])
            await photoCollectionIndex.updateSortableAttributes(['createdAt','updatedAt'])
        } else {
            photoCollectionIndex = client.index('photo-collections')
            await photoCollectionIndex.updateDisplayedAttributes(['id', 'imageCount', 'uuid', 'cover', 'title', 'subtitle', 'tags', 'recommend', 'status', 'description',   'updatedAt'])
            await photoCollectionIndex.updateFilterableAttributes(['id', 'imageCount', 'uuid', 'cover', 'title', 'subtitle', 'tags', 'recommend', 'status', 'description', 'updatedAt'])
            await photoCollectionIndex.updateSortableAttributes(['createdAt', 'updatedAt'])
        }
        return photoCollectionIndex;
    } catch (error) {
        console.error('Failed to initialize Meilisearch index:', error)
        return null;
    }
}