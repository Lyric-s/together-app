import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Text } from '@/components/ThemedText';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../constants/colors";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  date: Date | null;
  onChange: (date: Date | null) => void;
  minimumDate?: Date;
}

/**
 * Cross-platform date picker that renders a web `datetime-local` input or a native mobile date/time picker.
 *
 * @param date - Currently selected Date, or `null` if no date is chosen.
 * @param onChange - Callback invoked with the newly selected Date, or `null` when the web input is cleared.
 * @param minimumDate - Earliest selectable date (defaults to today).
 * @returns A JSX element presenting a platform-appropriate date/time selection UI.
 */
export default function DatePickerField({
  date,
  onChange,
  minimumDate = new Date(),
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const { t, language } = useLanguage();

  // Format YYYY-MM-DD HH:mm
  const formatDateTimeLocal = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const showPickerMobile = () => {
    if (Platform.OS === "android") {
      // d'abord la date
      DateTimePickerAndroid.open({
        value: date ?? new Date(),
        onChange: (event, selectedDate) => {
          if (event.type === "set" && selectedDate) {
            const newDate = new Date(selectedDate);

            DateTimePickerAndroid.open({
              value: newDate,
              onChange: (timeEvent, selectedTime) => {
                if (timeEvent.type === "set" ){
                  if (selectedTime) {
                    newDate.setHours(selectedTime.getHours());
                    newDate.setMinutes(selectedTime.getMinutes());
                    
                  } 
                  onChange(newDate);
                } else {
                   // User cancelled time picker, still apply date with current time
                    onChange(newDate);
                }
              },
              mode: "time",
            });
          }
        },
        mode: "date",
        minimumDate: minimumDate,
      });
    } else {
      setShowPicker(true); // iOS
    }
  };



  if (Platform.OS === "web") {
    return (
      <input
        type="datetime-local"
        style={{
          padding: 10,
          borderRadius: 8,
          borderWidth: 0,
          width: 200,
          backgroundColor: Colors.darkerWhite,
        }}
        min={formatDateTimeLocal(minimumDate)}
        value={date ? formatDateTimeLocal(date) : ""}
        onChange={(e) => {
          if (!e.target.value) return onChange(null);
          onChange(new Date(e.target.value));
        }}
      />
    );
  }

  // -------- Mobile (iOS/Android) ----------
  return (
    <View>
      <TouchableOpacity
        onPress={showPickerMobile}
        style={{
          padding: 10,
          backgroundColor: Colors.darkerWhite,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Text>
          {date
            ? date.toLocaleString(language === 'fr' ? "fr-FR" : "en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : t('chooseDate')}
        </Text>
      </TouchableOpacity>


      {Platform.OS === "ios" && showPicker && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="datetime"
          display="spinner"
          minimumDate={minimumDate}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              onChange(selectedDate);
              setShowPicker(false);
            }
          }}
        />
      )}


    </View> 
  );
}