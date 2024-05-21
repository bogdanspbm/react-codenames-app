package com.emkn.backend.datastore;

import java.sql.Connection;
import java.sql.DriverManager;

public abstract class DataStore {

    private Connection connection;

    public Connection getConnection() {
        return connection;
    }

    public void createConnection(String url) {
        try {
            connection = DriverManager.getConnection(url);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static DataStore createDataStore() {
        return null;
    }
}

