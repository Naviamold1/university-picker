import { createPersistentStore } from '$lib/persistentStore';

export const selectedUnis = createPersistentStore<string[]>('saved-list', []);
