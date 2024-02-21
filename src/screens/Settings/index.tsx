import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { List, Switch, useTheme } from 'react-native-paper'

import { PreferencesContext } from '../../context';
import { ThemeColorModal } from '../../components';

export default function Settings() {
  const theme = useTheme();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const preferences = React.useContext(PreferencesContext);
  const [modalVisible, setModalVisible] = useState(false);

  if (!preferences) throw new Error('PreferencesContext not provided');
  const {
    toggleTheme,
    changeThemeColor
  } = preferences;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <List.Section style={[styles.listSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.listItemContainer}>
          <List.Item
            style={[styles.listItem, { borderBottomColor: theme.colors.surfaceVariant }]}
            onPress={() => {
              onToggleSwitch();
              toggleTheme();
            }}
            title="Dark / Light"
            left={() => <List.Icon style={{ padding: 4, borderRadius: 100, backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} icon="theme-light-dark" />}
            right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch} style={styles.switchSize} />}
          />
          <List.Item
            style={[styles.listItem, { borderBottomColor: theme.colors.background }]}
            onPress={() => setModalVisible(true)}
            title="Change Theme Color"
            left={() => <List.Icon style={{ padding: 4, borderRadius: 100, backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} icon="palette" />}
            right={() => <List.Icon color={theme.colors.primary} icon="chevron-right" />}
          />
          <List.Item
            style={[styles.listItem, { borderBottomColor: theme.colors.background }]}
            onPress={() => setModalVisible(true)}
            title="Settings"
            left={() => <List.Icon style={{ padding: 4, borderRadius: 100, backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} icon="palette" />}
            right={() => <List.Icon color={theme.colors.primary} icon="lock-outline" />}
          />
        </View>
      </List.Section>
      <List.Section style={[styles.listSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.listItemContainer}>
          <List.Item
            style={[styles.listItem, { borderBottomColor: theme.colors.surfaceVariant }]}
            title="Dark / Light"
            left={() => <List.Icon color={theme.colors.primary} icon="theme-light-dark" />}
            right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch} style={styles.switchSize} />}
          />
          <List.Item
            style={[styles.listItem, { borderBottomColor: theme.colors.background }]}
            title="Settings"
            left={() => <List.Icon color={theme.colors.primary} icon="cog-outline" />}
            right={() => <List.Icon color={theme.colors.primary} icon="chevron-right" />}
          />
        </View>
      </List.Section>
      <ThemeColorModal onValueChange={(val: string) => changeThemeColor(val)} visible={modalVisible} setVisible={setModalVisible}></ThemeColorModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listSection: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  listItemContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  listItem: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  switchSize: {
    padding: 0,
    height: 32,
    alignSelf: "center",
    // transform: [{ scaleX: 32 / 36 }, { scaleY: 32 / 36 }]
  }
});
