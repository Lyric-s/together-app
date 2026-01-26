import { View, TextInput, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import { useRef, useState, useEffect } from "react";
import { Colors } from "../constants/colors";
import { styles } from "../styles/components/SearchBarStyle";
import { SearchFilters } from "../types/search.types";
import { useLanguage } from "@/context/LanguageContext";

interface SearchBarProps {
  categories?: string[]; // Renommé pour la clarté (était filters_1)
  onSearch: (text: string, filters: SearchFilters) => void;
}

// ... (rest of imports and types)

export default function SearchBar({
    categories = [],    
    onSearch,
  }: SearchBarProps) {

  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("-");
// ... (omitted code)
  return (
    <View style={[styles.container]}>
      
      <TextInput
        style={[styles.input, { minWidth: 300 }]}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={Colors.grayPlaceholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSearch}
      />

      <View style={[styles.flexContainer, { minWidth: 150, zIndex: 4000 }]}>
        
        <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => setIsCategoryOpen(!isCategoryOpen)}
        >
            <Text style={{ color: selectedCategory === "-" ? Colors.grayPlaceholder : Colors.black }}>
                {selectedCategory === "-" ? t('categoryPlaceholder') : selectedCategory}
            </Text>
            <Text style={{ position: 'absolute', right: 10, color: Colors.grayPlaceholder }}>▼</Text>
        </TouchableOpacity>

        {isCategoryOpen && (
            <View style={styles.suggestionsContainer}>
                <FlatList
                    data={["-", ...categories]}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.suggestionItem} 
                            onPress={() => selectCategory(item)}
                        >
                            <Text style={[
                                styles.suggestionText,
                                item === selectedCategory && { fontWeight: 'bold', color: Colors.orange }
                            ]}>
                                {item === "-" ? t('none') : item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )}
      </View>

      {/* --- LOCATION INPUT WITH AUTOCOMPLETE --- */}
      <View style={[styles.flexContainer, { maxWidth: 200 }]}>
        <TextInput
          style={[styles.input]}
          placeholder={t('cityOrZip')}
          placeholderTextColor={Colors.grayPlaceholder}
          value={locationInput}
          onChangeText={handleLocationChange}
        />
        {isLoadingLoc && (
           <ActivityIndicator size="small" color={Colors.orange} style={{position: 'absolute', right: 10, top: 12}}/>
        )}
{/* ... (omitted code) */}
      </View>
      
      <View style={[styles.flexContainer]}>
        <TextInput
          style={[styles.input]}
          placeholder={t('startDateLabel')}
          placeholderTextColor={Colors.grayPlaceholder}
          value={dateText}
          onChangeText={setDateText}
        />
      </View>

      {/* Button Reset */}
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
          <Text style={styles.resetText}>X</Text>
        </TouchableOpacity>

        {/* Search button */}
        <TouchableOpacity onPress={handleSearch}>
          <Image
            source={require("../assets/images/loupe.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}