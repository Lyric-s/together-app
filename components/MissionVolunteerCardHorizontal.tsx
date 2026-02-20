import { View, TouchableOpacity, Image, Platform } from "react-native";
import { Text } from '@/components/ThemedText';
import CategoryLabel from "./CategoryLabel";
import { styles } from "../styles/components/MissionVolunteerCardHorizontalStyle"
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
 * Render a horizontal mission card for volunteers including image, category, metadata, and an optional favorite control.
 *
 * Shows the mission image (with a fallback), category label, mission name, association name, formatted start date,
 * location (zip code and country when available), and enrolled / capacity counts. Tapping the card invokes `onPressMission`.
 *
 * @param mission - The mission object to display (uses fields such as `name`, `image_url`, `association`, `category`, `date_start`, `location`, `volunteers_enrolled`, and `capacity_max`)
 * @param onPressMission - Callback invoked when the card is pressed
 * @param isFavorite - Whether the mission is currently marked as favorite; controls the heart icon appearance
 * @param onPressFavorite - Optional callback invoked when the favorite (heart) button is pressed; if omitted the favorite control is not rendered
 * @returns A React element representing the mission card
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
      style={[
        styles.card,
        {
          width: isWeb ? '95%' : '95%',
          alignSelf: 'center',
          flexShrink: 0,
          marginBottom: 5
        }
      ]}
      onPress={() => {
        if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        onPressMission();
      }}
      activeOpacity={0.8}
    >

      <View style={styles.leftContainer}>
        <Image source={imageSource} style={styles.image} />

        <View style={styles.categoryLabelOverlay}>
          <CategoryLabel
            text={categoryLabel}
            backgroundColor={categoryColor}
          />
        </View>

        {onPressFavorite && (
          <TouchableOpacity 
            style={styles.heartButtonOverlay} 
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

      <View style={styles.rightContainer}>
        <View style={styles.contentTop}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{mission.name}</Text>
          <Text style={styles.association} numberOfLines={1} ellipsizeMode="tail">{assoName}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          {mission_location && <Text style={styles.city} numberOfLines={1} ellipsizeMode="tail">{mission_location}</Text>}
        </View>

        <View style={styles.peopleContainer}>
          <Text style={styles.peopleText}>
            {mission.volunteers_enrolled} / {mission.capacity_max}
          </Text>
          <Image
            source={require("../assets/images/people.png")}
            style={styles.peopleIcon}
            resizeMode="contain"
          />
        </View>
      </View>

    </TouchableOpacity>
  );
}