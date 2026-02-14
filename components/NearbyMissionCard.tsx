import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Mission } from "@/models/mission.model";
import { Colors } from "@/constants/colors";
import CategoryLabel from "@/components/CategoryLabel";
import { formatMissionDate } from "@/utils/date.utils";
import { styles } from "@/styles/components/NearbyMissionStyles";

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

    const missionLocation =
        [mission.location?.zip_code, mission.location?.country].filter(Boolean).join(", ") || "Lieu non précisé";

    const blurActiveElementOnWeb = () => {
        if (Platform.OS === "web" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (
        <TouchableOpacity
            onPress={() => {
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
                    <CategoryLabel text={categoryLabel} backgroundColor={categoryColor} />
                </View>

                {/* Heart */}
                {onPressFavorite && (
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => {
                            blurActiveElementOnWeb();
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
                <View style={styles.peopleBadge}>
                    <Text style={styles.peopleText}>
                        {mission.volunteers_enrolled} / {mission.capacity_max}
                    </Text>
                    <Image source={require("@/assets/images/people.png")} style={styles.peopleIcon} />
                </View>
            </View>

            {/* CONTENT */}
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
                    {missionLocation}
                </Text>

                {/* DISTANCE line */}
                {!!distanceLabel && (
                    <View style={styles.distanceRow}>
                        <Text style={{ fontSize: 15 }}>📍</Text>
                        <Text style={styles.distanceText}>{distanceLabel}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
