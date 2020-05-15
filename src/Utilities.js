export const CollectIdsAndDocs = (doc) => ({ id: doc.id, ...doc.data() });
