package com.emkn.backend.datastore;

import java.util.HashMap;
import java.util.Map;

public class SQLDataStore extends DataStore {

    private static Map<String, DataStore> cache = new HashMap<>();

    public static DataStore createDataStore(String url) {
        try {
            DataStore dataStore = new SQLDataStore();
            Class.forName("org.sqlite.JDBC");
            dataStore.createConnection(url);
            return dataStore;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static DataStore getDatastore(String url) {
        if (cache.containsKey(url)) {
            return cache.get(url);
        }

        DataStore dataStore = createDataStore(url);
        cache.put(url, dataStore);
        return dataStore;
    }
}
