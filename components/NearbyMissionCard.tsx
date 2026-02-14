import React from "react";
<<<<<<< HEAD
import { View, TouchableOpacity, Image, Platform } from "react-native";
import { Text } from "@/components/ThemedText";
=======
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)
import { Mission } from "@/models/mission.model";
import { Colors } from "@/constants/colors";
import CategoryLabel from "@/components/CategoryLabel";
import { formatMissionDate } from "@/utils/date.utils";
<<<<<<< HEAD
import { styles } from "@/styles/components/NearbyMissionStyles";
=======
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)

type Props = {
    mission: Mission;
    distanceLabel?: string; // ex: "4,8 km" / "396 m"
    onPressMission: () => void;
    onPressFavorite?: () => void;
    isFavorite?: boolean;
};

export default function NearbyMissionCard({
                                              mission,
                                              distanceLabel,
                                              onPressMission,
                                              onPressFavorite,
                                              isFavorite = false,
                                          }: Props) {
    const defaultImage = require("@/assets/images/volunteering_img.jpg");
    const imageSource = mission.image_url ? { uri: mission.image_url } : defaultImage;

    const formattedDate = formatMissionDate(mission.date_start);

    const assoName = mission.association?.name || "Association inconnue";
    const categoryLabel = mission.category?.label || "Général";
    const categoryColor = Colors.orange;

<<<<<<< HEAD
    const missionLocation =
        [mission.location?.zip_code, mission.location?.country].filter(Boolean).join(", ") || "Lieu non précisé";

    const blurActiveElementOnWeb = () => {
        if (Platform.OS === "web" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };
=======
    const enrolled = mission.volunteers_enrolled ?? 0;

    const missionLocation =
        [mission.location?.zip_code, mission.location?.country]
            .filter(Boolean)
            .join(", ") || "Lieu non précisé";

>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)

    return (
        <TouchableOpacity
            onPress={() => {
<<<<<<< HEAD
                blurActiveElementOnWeb();
                onPressMission();
            }}
            style={styles.card}
            activeOpacity={0.9}
        >
            {/* IMAGE */}
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} />

                {/* Category badge */}
                <View style={styles.categoryBadge}>
=======
                if (Platform.OS === "web" && document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                onPressMission();
            }}
            style={{
                width: 260,
                backgroundColor: Colors.white,
                borderRadius: 14,
                overflow: "hidden",
                shadowColor: Colors.black,
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 2,
            }}
            activeOpacity={0.9}
        >
            {/* IMAGE */}
            <View style={{ height: 120, width: "100%" }}>
                <Image source={imageSource} style={{ width: "100%", height: "100%" }} />

                {/* Category badge */}
                <View style={{ position: "absolute", top: 10, left: 10 }}>
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)
                    <CategoryLabel text={categoryLabel} backgroundColor={categoryColor} />
                </View>

                {/* Heart */}
                {onPressFavorite && (
                    <TouchableOpacity
<<<<<<< HEAD
                        style={styles.heartButton}
                        onPress={() => {
                            blurActiveElementOnWeb();
=======
                        style={{ position: "absolute", bottom: 10, left: 10, padding: 4 }}
                        onPress={() => {
                            if (Platform.OS === "web" && document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                            }
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)
                            onPressFavorite();
                        }}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={
                                isFavorite
                                    ? require("@/assets/images/red_heart.png")
                                    : require("@/assets/images/gray_heart.png")
                            }
                            style={{ width: 28, height: 28 }}
                        />
                    </TouchableOpacity>
                )}

                {/* People badge (top-right pill like your mock) */}
<<<<<<< HEAD
                <View style={styles.peopleBadge}>
                    <Text style={styles.peopleText}>
                        {mission.volunteers_enrolled} / {mission.capacity_max}
                    </Text>
                    <Image source={require("@/assets/images/people.png")} style={styles.peopleIcon} />
=======
                <View
                    style={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        borderWidth: 1,
                        borderColor: Colors.orange,
                        backgroundColor: Colors.white,
                        borderRadius: 16,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <Text style={{ fontWeight: "700", color: Colors.black }}>
                        {mission.volunteers_enrolled} / {mission.capacity_max}
                    </Text>
                    <Image source={require("@/assets/images/people.png")} style={{ width: 18, height: 18 }} />
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)
                </View>
            </View>

            {/* CONTENT */}
<<<<<<< HEAD
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {mission.name}
                </Text>

                <Text style={styles.association} numberOfLines={1}>
                    {assoName}
                </Text>

                <View style={styles.dateRow}>
                    <Text style={[styles.dateDot, { color: Colors.palePurple }]}>●</Text>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>

                <Text style={styles.location} numberOfLines={1}>
=======
            <View style={{ padding: 12, gap: 3 }}>
                <Text style={{ fontSize: 15, fontWeight: "800", color: Colors.black }} numberOfLines={1}>
                    {mission.name}
                </Text>
                <Text style={{ fontSize: 12.5, color: Colors.grayPlaceholder }} numberOfLines={1}>
                    {assoName}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <Text style={{ color: '#81458F', fontSize: 12 }}>●</Text>
                    <Text style={{ fontSize: 12.5, color: Colors.black }}>{formattedDate}</Text>
                </View>

                <Text style={{ fontSize: 12.5, color: Colors.grayPlaceholder }} numberOfLines={1}>
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)
                    {missionLocation}
                </Text>

                {/* DISTANCE line */}
                {!!distanceLabel && (
<<<<<<< HEAD
                    <View style={styles.distanceRow}>
                        <Text style={{ fontSize: 15 }}>📍</Text>
                        <Text style={styles.distanceText}>{distanceLabel}</Text>
=======
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <Text style={{ fontSize: 15 }}>📍</Text>
                        <Text style={{ fontSize: 14, fontWeight: "800", color: Colors.orange }}>
                            {distanceLabel}
                        </Text>
>>>>>>> efb5352 (feat: TA-126  adding geolocalisation option + changes to searchmission page + adding cache for geolocalisation)
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
