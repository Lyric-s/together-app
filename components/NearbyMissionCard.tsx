import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Mission } from "@/models/mission.model";
import { Colors } from "@/constants/colors";
import CategoryLabel from "@/components/CategoryLabel";
import { formatMissionDate } from "@/utils/date.utils";

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

    const enrolled = mission.volunteers_enrolled ?? 0;

    const missionLocation =
        [mission.location?.zip_code, mission.location?.country]
            .filter(Boolean)
            .join(", ") || "Lieu non précisé";


    return (
        <TouchableOpacity
            onPress={() => {
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
                    <CategoryLabel text={categoryLabel} backgroundColor={categoryColor} />
                </View>

                {/* Heart */}
                {onPressFavorite && (
                    <TouchableOpacity
                        style={{ position: "absolute", bottom: 10, left: 10, padding: 4 }}
                        onPress={() => {
                            if (Platform.OS === "web" && document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                            }
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
                </View>
            </View>

            {/* CONTENT */}
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
                    {missionLocation}
                </Text>

                {/* DISTANCE line */}
                {!!distanceLabel && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <Text style={{ fontSize: 15 }}>📍</Text>
                        <Text style={{ fontSize: 14, fontWeight: "800", color: Colors.orange }}>
                            {distanceLabel}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
