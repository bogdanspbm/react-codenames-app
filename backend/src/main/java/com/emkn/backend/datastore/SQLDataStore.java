package com.emkn.backend.datastore;

public class SQLDataStore extends DataStore {
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
}
