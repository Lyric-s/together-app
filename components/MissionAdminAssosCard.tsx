import React from "react";
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { styles } from "../styles/components/MissionAdminAssosCardStyle";
import { Mission } from "@/models/mission.model";
import { formatMissionDate } from "@/utils/date.utils";
import { router } from "expo-router";

interface MissionAdminAssosCardProps {
    mission: Mission;
}

/**
 * Renders an admin/association mission card.
 *
 * Same visual behavior as before, but now based on Mission model
 */
export default function MissionAdminAssosCard({
    mission,
}: MissionAdminAssosCardProps) {

    const missionTitle = mission.name;
    const associationName = mission.association?.name || "Association inconnue";
    const defaultImage = require("../assets/images/volunteering_img.jpg");
    const imageSource = mission.image_url 
    ? { uri: mission.image_url } 
    : defaultImage;

    const formattedDate = formatMissionDate(mission.date_start);

    return (
        <View style={styles.card}>
            {/* Image */}
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} />
            </View>

            {/* Text + button */}
            <View style={styles.bottomRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{missionTitle}</Text>
                    <Text style={styles.association}>{associationName}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>

                <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => router.push(`/(association)/library/history/${mission.id_mission.toString()}`)} 
                >
                    <Text style={styles.detailButtonText}>Voir détails</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
