import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, styles } from "../styles/theme";
import BrandMark from "../components/BrandMark";
import BackButton from "../components/BackButton";

const roles: {
  id: string;
  title: string;
  description: string;
  icon: SymbolViewProps["name"];
}[] = [
  {
    id: "resident",
    title: "Resident",
    description: "Resident of the society",
    icon: { ios: "person", android: "person", web: "person" },
  },
  {
    id: "admin",
    title: "Society Admin",
    description: "Manage and administer the society",
    icon: {
      ios: "person.badge.key",
      android: "admin_panel_settings",
      web: "admin_panel_settings",
    },
  },
  {
    id: "security",
    title: "Security",
    description: "Security staff of the society",
    icon: {
      ios: "shield.lefthalf.filled",
      android: "security",
      web: "security",
    },
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Maintenance staff of the society",
    icon: {
      ios: "wrench.and.screwdriver",
      android: "build",
      web: "build",
    },
  },
];

export default function Role() {
  const router = useRouter();

  const { society, societyId } = useLocalSearchParams<{
    society: string;
    societyId: string;
  }>();

  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert("Select Role", "Please choose your role.");
      return;
    }

    router.push({
      pathname: "/details",
      params: {
        society,
        societyId,
        role: selectedRole,
      },
    });
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <View style={styles.authContent}>
          <View style={styles.authHeader}>
            <BrandMark />

            <Text style={styles.eyebrow}>GATED LIVING SANCTUARY</Text>

            <Text style={styles.pageTitle}>Choose Your Role</Text>

            <Text style={styles.pageSubtitle}>
              Select how you are associated with your society
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Your Association</Text>

            {roles.map((role) => {
              const isSelected = selectedRole === role.id;

              return (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleOption,
                    isSelected && styles.roleOptionSelected,
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.roleIcon}>
                    <SymbolView
                      name={role.icon}
                      tintColor={colors.brown}
                      size={21}
                    />
                  </View>

                  <View style={styles.roleCopy}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>
                      {role.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.roleOptionCheck}>
                      <SymbolView
                        name={{
                          ios: "checkmark.circle.fill",
                          android: "check_circle",
                          web: "check_circle",
                        }}
                        tintColor={colors.brown}
                        size={22}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.primaryButton, styles.formButton]}
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>

              <SymbolView
                name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
                tintColor={colors.white}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
