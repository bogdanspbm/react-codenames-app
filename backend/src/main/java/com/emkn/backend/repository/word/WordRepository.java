package com.emkn.backend.repository.word;

import com.emkn.backend.model.WordDTO;

import java.util.List;

public interface WordRepository {
    List<WordDTO> getWords(int limit, int offset, String localization);

    List<WordDTO> getRandomWords(int limit, String localization);

    WordDTO getWordByID(int id, String localization);
}
