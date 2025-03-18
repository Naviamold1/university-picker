import { writable } from 'svelte/store';

export function createPersistentStore<T>(key: string, initialValue: T) {
	//@ts-expect-error because yes ok
	const store = writable(initialValue, () => {
		if (typeof window !== 'undefined') {
			const savedValue = localStorage.getItem(key);
			if (savedValue !== null) {
				store.set(JSON.parse(savedValue));
			}
		}

		//@ts-expect-error because yes ok
		const unsubscribe = store.subscribe((value) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem(key, JSON.stringify(value));
			}
		});
		return unsubscribe;
	});

	return store;
}
