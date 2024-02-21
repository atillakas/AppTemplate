import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal, Portal, Button, useTheme, Text } from 'react-native-paper';
import { colorThemes } from '../utils';

const CIRCLE_SIZE = 40;
const CIRCLE_RING_SIZE = 2;

export function ThemeColorModal({ visible, setVisible, onValueChange }: any) {

    const [value, setValue] = useState(0);
    const theme = useTheme();
    const [color, setColor] = useState(colorThemes[Object.keys(colorThemes)[0]].light.colors.primary);
    return (
        <View>
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}>
                    <View style={[styles.sheetHeader, { borderBottomColor: theme.colors.surfaceVariant }]}>
                        <Text style={styles.sheetHeaderTitle}>Select profile color</Text>
                    </View>
                    <View style={styles.sheetBody}>
                        <View style={[styles.profile, { backgroundColor: color }]}>
                            <Text style={styles.profileText}>MB</Text>
                        </View>
                        <View style={styles.group}>
                            {Object.keys(colorThemes).map((themeName, index) => {
                                const isActive = value === index;
                                const theme = colorThemes[themeName].light;
                                
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setValue(index);
                                            setColor(theme.colors.primary);
                                            onValueChange && onValueChange(themeName);
                                        }}
                                        style={[styles.circle, isActive && { borderColor: theme.colors.primaryContainer }]}>
                                        <View style={[styles.circleInside, { backgroundColor: theme.colors.primary }]} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Button icon="palette" mode="contained" onPress={() => setVisible(false)}>
                            Confirm
                        </Button>

                    </View>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 14,
    },
    sheetHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    sheetHeaderTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    sheetBody: {
        padding: 24,
    },
    profile: {
        alignSelf: 'center',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    profileText: {
        fontSize: 34,
        fontWeight: '600',
        color: 'white',
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    circle: {
        width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        borderRadius: 9999,
        backgroundColor: 'white',
        borderWidth: CIRCLE_RING_SIZE,
        borderColor: 'transparent',
        marginRight: 8,
        marginBottom: 12,
    },
    circleInside: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: 9999,
        position: 'absolute',
        top: CIRCLE_RING_SIZE,
        left: CIRCLE_RING_SIZE,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        padding: 14,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#000',
        marginBottom: 12,
    },
});
