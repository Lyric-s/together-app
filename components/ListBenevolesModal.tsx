import React, { useEffect, useRef } from 'react';
import { Colors } from '@/constants/colors';
import { VolunteerWithStatus } from '@/models/volunteer.model';
import { styles } from '@/styles/pages/ChangeMissionCSS';
import { FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';

type Benevole = {
    id: string;
    lastname: string;
    firstname: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    title: string;
    search: string;
    setSearch: (value: string) => void;
    benevoles: VolunteerWithStatus[]; // list of volunteers
    setBenevoles: (value: VolunteerWithStatus[]) => void;
    missionId: number; // <-- new prop to know which mission
};

export default function ListeBenevolesModal({
    visible,
    onClose,
    title,
    search,
    setSearch,
    benevoles,
    setBenevoles,
    missionId,
}: Props) {
    const [rejectionReason, setRejectionReason] = useState('');
    const [volunteerIdToReject, setVolunteerIdToReject] = useState<number | null>(null);

    // ---------------------
    // FILTER VOLUNTEERS BY SEARCH
    // ---------------------
    const filteredBenevoles = benevoles.filter(b =>
        (b.last_name + ' ' + b.first_name).toLowerCase().includes(search.toLowerCase())
    );
    

    // ---------------------
    // TRIGGER REJECTION FLOW
    // ---------------------
    const openRejectionInput = (volunteerId: number) => {
        setVolunteerIdToReject(volunteerId);
        setRejectionReason('');
    };

    const searchInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible && Platform.OS === 'web') {
            // Petit délai pour laisser le temps à la modale de s'afficher
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const renderItem = ({ item }: { item: Benevole }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.benevoleText}>
            {item.last_name} {item.first_name}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Bouton ACCEPTER */}
            {item.state === ProcessingStatus.PENDING && (
                <TouchableOpacity
                style={[
                    styles.croixCircle,
                    { backgroundColor: '#059669' },
                ]}
                onPress={() => acceptBenevole(item.id_volunteer)}
                >
                <Text style={styles.croixText}>✓</Text>
                </TouchableOpacity>
            )}

            {/* Bouton REFUSER */}
            <TouchableOpacity
                style={styles.croixCircle}
                onPress={() => openRejectionInput(item.id_volunteer)}
            >
                <Text style={styles.croixText}>×</Text>
            </TouchableOpacity>
            </View>
        </View>
        );


    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
        {/* @ts-ignore */}
        <View style={styles.modalBackground} accessibilityViewIsModal={true}>
            <View style={styles.modalContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>{title} - Liste des bénévoles</Text>
                <TouchableOpacity onPress={onClose}>
                <Text style={[styles.croixText, { fontSize: 50, color: Colors.red }]}>×</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.searchBar, { flexDirection: 'row', alignItems: 'center'}]}>
                <Image
                    source={require('@/assets/images/loupe.png')}
                    style={styles.icon}
                />
                <TextInput
                    ref={searchInputRef}
                    placeholder="Recherche un bénévole"
                    value={search}
                    onChangeText={setSearch}
                    style={{ flex: 1, fontSize: 16, padding: 0, margin: 0, borderWidth: 0, outlineWidth: 0 }}
                />
            </View>

                    <View style={[styles.searchBar, { flexDirection: 'row', alignItems: 'center'}]}>
                        <Image
                            source={require('@/assets/images/loupe.png')}
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Recherche un bénévole"
                            value={search}
                            onChangeText={setSearch}
                            style={{ flex: 1, fontSize: 16, padding: 0, margin: 0, borderWidth: 0, outlineWidth: 0 }}
                        />
                    </View>

                    <FlatList
                        data={filteredBenevoles}
                        keyExtractor={item => item.id_volunteer.toString()}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        style={{ marginBottom: 20 }}
                    />

                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.buttonBackgroundViolet, marginHorizontal: 50}]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Envoyer un mail aux bénévoles</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
