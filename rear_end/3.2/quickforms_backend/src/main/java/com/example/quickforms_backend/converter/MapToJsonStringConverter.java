package com.example.quickforms_backend.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// This converter class is used to convert a Map<String, Object> to a JSON string for database storage
// and convert it back to a Map<String, Object> when reading from the database.
// 此轉換器類別用於將Map<String, Object>轉換為JSON字串以供資料庫存儲
// 並在從資料庫讀取時轉換回 Map<String, Object>。

@Converter(autoApply = true)
public class MapToJsonStringConverter implements AttributeConverter<Map<String, Object>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Object> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting map to JSON string", e);
        }
    }

    @Override
    public Map<String, Object> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new HashMap<>();
        }
        try {
            Map<String, Object> map = objectMapper.readValue(dbData, HashMap.class);
            map = handleNestedMap(map);
            return map;
        } catch (IOException e) {
            throw new IllegalArgumentException("Error converting JSON string to map", e);
        }
    }

    private Map<String, Object> handleNestedMap(Map<String, Object> map) {
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (entry.getValue() instanceof Map) {
                map.put(entry.getKey(), handleNestedMap((Map<String, Object>) entry.getValue()));
            } else if (entry.getValue() instanceof List) {
                List<Object> list = (List<Object>) entry.getValue();
                for (int i = 0; i < list.size(); i++) {
                    if (list.get(i) instanceof Map) {
                        list.set(i, handleNestedMap((Map<String, Object>) list.get(i)));
                    }
                }
            }
        }
        return map;
    }
}
