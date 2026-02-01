import { View, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import { Text } from '@/components/ThemedText';
import { useRef, useState, useEffect } from "react";
import { Colors } from "../constants/colors";
import { styles } from "../styles/components/SearchBarStyle";
import { SearchFilters } from "../types/search.types";
import { useLanguage } from "@/context/LanguageContext";

interface SearchBarProps {
  categories?: string[]; // Renommé pour la clarté (était filters_1)
  onSearch: (text: string, filters: SearchFilters) => void;
}

// Type for API results
interface CityResult {
  properties: {
    label: string;
    postcode: string;
    city: string;
    context: string;
  };
}

/**
 * Render a search bar with inputs for query text, category, postal code, and start date, plus controls to execute or reset the search.
 *
 * The component calls `onSearch` when the user submits a search or presses the search button, passing the current text and a `SearchFilters` object where empty fields are represented as `null` and a valid `dateText` is parsed to a `Date`.
 *
 * @param categories - Optional list of category labels displayed in the category picker; the picker shows a default "Catégorie..." option mapped to `null`.
 * @param onSearch - Callback invoked with `(text: string, filters: SearchFilters)` when a search is triggered. `filters` has the shape `{ category: string | null; zipCode: string | null; date: Date | null }`.
 * @returns The rendered search bar React element containing inputs and action buttons.
 */

export default function SearchBar({
    categories = [],    
    onSearch,
  }: SearchBarProps) {

  const { t, getFontSize, fontFamily } = useLanguage();
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("-");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [dateText, setDateText] = useState("");

  // --- Location Autocomplete States ---
  const [locationInput, setLocationInput] = useState("");
  const [confirmedZip, setConfirmedZip] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  function resetAll() {
    setText("");
    setSelectedCategory("-");
    setIsCategoryOpen(false);
    setLocationInput("");
    setConfirmedZip(null);
    setSuggestions([]);
    setDateText("");
    onSearch("", { category: null, zipCode: null, date: null });
  }

  const fetchCities = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingLoc(true);
    try {
      const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 5000);
     
     const response = await fetch(
       `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=5`,
       { signal: controller.signal }
     );
     clearTimeout(timeoutId);
     
     if (!response.ok) {
       throw new Error(`HTTP ${response.status}`);
     }
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching cities", error);
      setSuggestions([]);
    } finally {
      setIsLoadingLoc(false);
    }
  };

  const handleLocationChange = (val: string) => {
    setLocationInput(val);
    setConfirmedZip(null); 
    
    // Debounce API call
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchCities(val);
    }, 400);
  };

  const selectCity = (item: CityResult) => {
    const displayLabel = `${item.properties.city} (${item.properties.postcode})`;
    setLocationInput(displayLabel);
    setConfirmedZip(item.properties.postcode);
    setSuggestions([]);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  };

  const selectCategory = (cat: string) => {
      setSelectedCategory(cat);
      setIsCategoryOpen(false);
  };

  // --- Search Logic ---
  const handleSearch = () => {
    let dateObj: Date | null = null;
    if (dateText) {
      // Validate YYYY-MM-DD format explicitly
      const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        const d = new Date(year, month, day);
        // Verify the date didn't roll over (e.g., Feb 31 -> Mar 2)
        if (!isNaN(d.getTime()) && 
          d.getFullYear() === year && 
          d.getMonth() === month && 
          d.getDate() === day) {
            dateObj = d;
          }
        }
    }

    onSearch(text, {
      category: selectedCategory === "-" ? null : selectedCategory,
      zipCode: confirmedZip, 
      date: dateObj
    });
  };

  return (
    <View style={[styles.container]}>
      
      <TextInput
        style={[styles.input, { minWidth: 300, fontSize: getFontSize(14), fontFamily }]}
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
                                item === selectedCategory ? { fontWeight: 'bold', color: Colors.orange } : {}
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
      <View style={[styles.flexContainer, { maxWidth: 200, zIndex: 5000, elevation: 5000}]}>
        <TextInput
          style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
          placeholder={t('cityOrZip')}
          placeholderTextColor={Colors.grayPlaceholder}
          value={locationInput}
          onChangeText={handleLocationChange}
        />
        {isLoadingLoc && (
           <ActivityIndicator size="small" color={Colors.orange} style={{position: 'absolute', right: 10, top: 12}}/>
        )}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => `${item.properties.city}-${item.properties.postcode}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionItem} 
                  onPress={() => selectCity(item)}
                >
                  <Text style={styles.suggestionText}>
                    {item.properties.city} <Text style={{fontWeight:'bold'}}>{item.properties.postcode}</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
      
      <View style={[styles.flexContainer]}>
        <TextInput
          style={[styles.input, { fontSize: getFontSize(14), fontFamily }]}
          placeholder={t('startDatePlaceholder')}
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