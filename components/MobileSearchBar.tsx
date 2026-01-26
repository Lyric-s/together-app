import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Modal,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles/components/MobileSearchBarStyle";
import { Colors } from "@/constants/colors";
import { SearchFilters } from "../types/search.types";
import { useLanguage } from "@/context/LanguageContext";

// ... (rest of types)

export default function MobileSearchBar({
  onSearch,
  category_list,
  default_city,
}: Props) {
  const { t, language } = useLanguage();
  const [searchText, setSearchText] = useState("");
// ... (omitted code)
  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
                // @ts-ignore
                document.activeElement.blur();
            }
            setFiltersOpen(true);
          }}
          style={styles.iconButton}
        >
          <Image source={require("../assets/images/setting.png")} style={styles.icon} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={Colors.grayPlaceholder}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={applySearch}
        />

        <TouchableOpacity onPress={applySearch} style={styles.iconButton}>
          <Image source={require("../assets/images/loupe2.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* ACTIVE FILTERS CHIPS */}
      <View style={styles.activeFiltersContainer}>
        {(selectedCityName || selectedZipCode) && (
          <View style={styles.filterTag}>
            <Text style={styles.filterText}>
               {selectedCityName ? selectedCityName : t('zone')} {selectedZipCode ? `(${selectedZipCode})` : ""}
            </Text>
          </View>
        )}
        {selectedCategory && (
            <View style={styles.filterTag}>
                <Text style={styles.filterText}>{selectedCategory}</Text>
            </View>
        )}
        {selectedDate && (
          <View style={styles.filterTag}>
            <Text style={styles.filterText}>
              {t('from')} {selectedDate.toLocaleDateString(language === 'fr' ? "fr-FR" : "en-US")}
            </Text>
          </View>
        )}
      </View>

      {/* FILTERS PANEL */}
      <Modal visible={filtersOpen} animationType="slide" presentationStyle="pageSheet">
        {/* @ts-ignore */}
        <View style={internalStyles.modalContainer} accessibilityViewIsModal={true}>
            <View style={internalStyles.modalHeader}>
                <Text style={internalStyles.modalTitle}>{t('filters')}</Text>
                <TouchableOpacity onPress={() => setFiltersOpen(false)}>
                    <Text style={{fontSize: 20, padding: 10}}>✕</Text>
                </TouchableOpacity>
            </View>

          {/* 1. City / Zip Code Filter */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              <Text style={styles.filterTitle}>{t('cityOrZipFull')}</Text>
              <TextInput
                ref={cityInputRef}
                style={[styles.filterInput, { borderWidth: 1, borderColor: Colors.grayBorder, padding: 10, borderRadius: 8 }]}
                placeholder={t('cityOrZipExample')}
                value={cityInputText}
                onChangeText={(text) => {
                  setCityInputText(text);
                  fetchCitySuggestions(text);
                }}
              />

              {citySuggestions.length > 0 && (
                <View style={internalStyles.suggestionsContainer}>
                  {citySuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={internalStyles.suggestionItem}
                      onPress={() => handleSelectCity(item)}
                    >
                      <Text>{item.nom} {item.codesPostaux?.[0] ? `(${item.codesPostaux[0]})` : ""}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 2. Category Filter */}
              <Text style={styles.filterTitle}>{t('categoryLabel')}</Text>
              <View style={styles.categoryList}>
                {category_list.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      selectedCategory === cat && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  >
                    <Text style={styles.categoryText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 3. Date Filter */}
              <Text style={styles.filterTitle}>{t('startDateLabel')}</Text>
              
              <TouchableOpacity 
                onPress={toggleDatePicker}
                style={internalStyles.dateButton}
              >
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    {selectedDate ? selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : t('selectDate')}
                </Text>
              </TouchableOpacity>

              {/* Gestion Spécifique iOS vs Android pour le Picker */}
              {showDatePicker && (
                <View style={internalStyles.datePickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    themeVariant="light"
                    style={Platform.OS === 'ios' ? { width: '100%' } : undefined} 
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity 
                        onPress={() => setShowDatePicker(false)}
                        style={{alignItems: 'center', padding: 10}}
                      >
                          <Text style={{color: 'blue'}}>{t('hideCalendar')}</Text>
                      </TouchableOpacity>
                  )}
                </View>
              )}
              {/* Action Buttons */}
              <View style={{flexDirection: 'row', gap: 10, marginTop: 30}}>
                <TouchableOpacity
                  style={[styles.resetButton, {flex: 1, backgroundColor: Colors.whiteLittleGray}]}
                  onPress={resetFilters}
                >
                  <Text style={[styles.resetButtonText, {color: 'black'}]}>{t('clear')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.resetButton, {flex: 1, backgroundColor: 'black'}]}
                  onPress={applySearch}
                >
                  <Text style={[styles.resetButtonText, {color: 'white'}]}>{t('seeResults')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

// Styles internes pour le Modal DatePicker iOS
const internalStyles = StyleSheet.create({
  dateButton: {
    backgroundColor: Colors.darkerWhite, 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.grayBorder,
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayToWhite
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  suggestionsContainer: {
    marginTop: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayToWhite,
    borderRadius: 8,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  datePickerContainer: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});