import { View, TouchableOpacity, Image, Platform } from "react-native";
import { Text } from '@/components/ThemedText';
import CategoryLabel from "./CategoryLabel";
import { styles } from "../styles/components/MissionVolunteerCardStyle"
import { Mission } from "@/models/mission.model";
import { Colors } from "@/constants/colors";
import { formatMissionDate } from "@/utils/date.utils";
import { useLanguage } from "@/context/LanguageContext";

interface MissionCardProps {
  mission: Mission; 
  onPressMission: () => void;
  onPressFavorite?: () => void;
  isFavorite?: boolean;
}

/**
 * Display a touchable mission card with image, category badge, mission details, and volunteer counts.
 *
 * @param mission - Mission data used to populate the card fields
 * @param onPressMission - Callback invoked when the card is pressed
 * @param isFavorite - Whether the mission is currently favorited
 * @param onPressFavorite - Optional callback invoked when the favorite toggle is pressed
 * @returns The rendered mission card element
 */

export default function MissionVolunteerCard({
  mission,
  onPressMission,
  isFavorite = false,
  onPressFavorite,
}: MissionCardProps) {

  const isWeb = Platform.OS === 'web';
  const { t, language } = useLanguage();
  const defaultImage = require("../assets/images/volunteering_img.jpg");
  const imageSource = mission.image_url 
    ? { uri: mission.image_url } 
    : defaultImage;
  
  const formattedDate = formatMissionDate(mission.date_start, language) || t('unknownDate');

  const assoName = mission.association?.name || t('unknownAssociation');
  const categoryLabel = mission.category?.label || t('generalCategory');
  const categoryColor = Colors.orange;

  const locationParts = [mission.location?.zip_code, mission.location?.country].filter(Boolean);
  const mission_location = locationParts.length > 0 
  ? locationParts.join(', ') 
  : t('locationUnspecified');

  return (
    <TouchableOpacity 
      style={[styles.card, { alignSelf: isWeb ? 'center' : 'auto',}]} 
      onPress={() => {
         if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
             document.activeElement.blur();
         }
         onPressMission();
      }}
    >
      
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />

        {/* Category label */}
        <View style={styles.categoryLabel}>
          <CategoryLabel
            text={categoryLabel}
            backgroundColor={categoryColor}
          />
        </View>

        {/* Heart  (optional) */}
        {onPressFavorite && (
            <TouchableOpacity 
                style={styles.heartButton} 
                onPress={() => {
                    if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                    onPressFavorite();
                }} 
                activeOpacity={0.7}
            >
                <Image
                    source={
                        isFavorite
                            ? require("../assets/images/red_heart.png")
                            : require("../assets/images/gray_heart.png")
                    }
                    style={styles.heartIcon}
                />
            </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{mission.name}</Text>
        <Text style={styles.association}>{assoName}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.city}>{mission_location}</Text>
      </View>

      <View style={styles.peopleContainer}>
        <Image
          source={require("../assets/images/people.png")}
          style={styles.peopleIcon}
        />
        <Text style={styles.peopleText}>
          {mission.volunteers_enrolled} / {mission.capacity_max}
        </Text>
      </View>
    </TouchableOpacity>
  );
}