import { createRxDatabase, type RxCollection, type RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

const DATABASE_NAME = "rtse-presentation";
const COLLECTION_NAME = "presentation_state";
const DOCUMENT_ID = "current";
const CHANNEL_NAME = "rtse-presentation-slide-sync";
const STORAGE_SYNC_KEY = "rtse-presentation-slide-sync";

type PresentationStateDoc = {
  id: string;
  currentIndex: number;
  updatedAt: string;
};

type PresentationCollections = {
  presentation_state: RxCollection<PresentationStateDoc>;
};

let databasePromise: Promise<RxDatabase<PresentationCollections>> | null = null;
let syncChannel: BroadcastChannel | null = null;

function getSyncChannel() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  if (!syncChannel) {
    syncChannel = new BroadcastChannel(CHANNEL_NAME);
  }

  return syncChannel;
}

function broadcastIndex(index: number) {
  getSyncChannel()?.postMessage(index);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      STORAGE_SYNC_KEY,
      JSON.stringify({
        index,
        updatedAt: Date.now(),
      }),
    );
  }
}

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = createRxDatabase<PresentationCollections>({
      name: DATABASE_NAME,
      storage: getRxStorageDexie(),
      multiInstance: true,
    }).then(async (database) => {
      await database.addCollections({
        [COLLECTION_NAME]: {
          schema: {
            title: "presentation state schema",
            version: 0,
            primaryKey: "id",
            type: "object",
            properties: {
              id: {
                type: "string",
                maxLength: 32,
              },
              currentIndex: {
                type: "number",
                minimum: 0,
              },
              updatedAt: {
                type: "string",
              },
            },
            required: ["id", "currentIndex", "updatedAt"],
          },
        },
      });

      const collection = database[COLLECTION_NAME];
      const existing = await collection.findOne(DOCUMENT_ID).exec();
      if (!existing) {
        await collection.insert({
          id: DOCUMENT_ID,
          currentIndex: 0,
          updatedAt: new Date().toISOString(),
        });
      }

      return database;
    });
  }

  return databasePromise;
}

async function getCollection() {
  const database = await getDatabase();
  return database[COLLECTION_NAME];
}

export async function subscribeToCurrentSlide(onChange: (index: number) => void) {
  const collection = await getCollection();
  const initialDocument = await collection.findOne(DOCUMENT_ID).exec();
  onChange(initialDocument?.get("currentIndex") ?? 0);

  const document$ = collection.findOne(DOCUMENT_ID).$;
  const subscription = document$.subscribe((document) => {
    onChange(document?.get("currentIndex") ?? 0);
  });

  const channel = getSyncChannel();
  const onMessage = (event: MessageEvent<number>) => {
    onChange(event.data ?? 0);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_SYNC_KEY || !event.newValue) return;

    try {
      const payload = JSON.parse(event.newValue) as { index?: number };
      if (typeof payload.index === "number") {
        onChange(payload.index);
      }
    } catch {
      // Ignore malformed sync payloads.
    }
  };

  channel?.addEventListener("message", onMessage);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    subscription.unsubscribe();
    channel?.removeEventListener("message", onMessage);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export async function setPersistedSlide(index: number) {
  const collection = await getCollection();
  await collection.upsert({
    id: DOCUMENT_ID,
    currentIndex: index,
    updatedAt: new Date().toISOString(),
  });

  broadcastIndex(index);
}
