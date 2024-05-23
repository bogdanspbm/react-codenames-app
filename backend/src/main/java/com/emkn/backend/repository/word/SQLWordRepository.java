package com.emkn.backend.repository.word;

import com.emkn.backend.datastore.DataStore;
import com.emkn.backend.datastore.SQLDataStore;
import com.emkn.backend.model.WordDTO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SQLWordRepository implements WordRepository {

    private DataStore dataStore;

    public SQLWordRepository() {
        dataStore = SQLDataStore.getDatastore("jdbc:sqlite:database.sqlite");
    }

    public SQLWordRepository(SQLDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public List<WordDTO> getWords(int limit, int offset, String localization) {
        String query = "SELECT * FROM words WHERE " + getColumnNameByLocal(localization) + " IS NOT NULL LIMIT ? OFFSET ?";
        try {
            PreparedStatement statement = dataStore.getConnection().prepareStatement(query);
            statement.setInt(1, limit);
            statement.setInt(2, offset);
            ResultSet resultSet = statement.executeQuery();
            List<WordDTO> output = parseResultSet(resultSet, localization);

            resultSet.close();
            statement.close();

            return output;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    @Override
    public List<WordDTO> getRandomWords(int limit, String localization) {
        String query = "SELECT * FROM words WHERE " + getColumnNameByLocal(localization) + " IS NOT NULL ORDER BY RANDOM() LIMIT ?";
        try {
            PreparedStatement statement = dataStore.getConnection().prepareStatement(query);
            statement.setInt(1, limit);
            ResultSet resultSet = statement.executeQuery();
            List<WordDTO> output = parseResultSet(resultSet, localization);

            resultSet.close();
            statement.close();

            return output;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    @Override
    public WordDTO getWordByID(int id, String localization) {
        String query = "SELECT * FROM words WHERE " + getColumnNameByLocal(localization) + " IS NOT NULL AND ID = ?";
        try {
            PreparedStatement statement = dataStore.getConnection().prepareStatement(query);
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();
            List<WordDTO> output = parseResultSet(resultSet, localization);

            resultSet.close();
            statement.close();

            return output.stream().findFirst().orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getColumnNameByLocal(String localization) {
        switch (localization) {
            case "de": {
                return "word_de";
            }
            case "ru": {
                return "word_ru";
            }
            default: {
                return "word_en";
            }
        }
    }


    private List<WordDTO> parseResultSet(ResultSet resultSet, String localization) {
        List<WordDTO> output = new ArrayList<>();
        try {
            while (resultSet.next()) {
                WordDTO wordDTO = new WordDTO();
                wordDTO.setLang(localization);
                wordDTO.setId(resultSet.getInt("id"));
                String word = resultSet.getString(getColumnNameByLocal(localization));
                wordDTO.setWord(Arrays.stream(word.split(",")).findFirst().orElse(""));
                output.add(wordDTO);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return output;
    }
}
