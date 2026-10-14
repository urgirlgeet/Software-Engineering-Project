import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { colors, styles } from "../styles/theme";

const roles = [
  {
    id: "resident",
    title: "Resident",
    description: "Resident of the society",
  },
  {
    id: "admin",
    title: "Society Admin",
    description: "Manage and administer the society",
  },
  {
    id: "security",
    title: "Security",
    description: "Security staff of the society",
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Maintenance staff of the society",
  },
];

export default function Role() {
  const router = useRouter();

  const { name, phone, email, password, society } = useLocalSearchParams<{
    name: string;
    phone: string;
    email: string;
    password: string;
    society: string;
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
        name,
        phone,
        email,
        password,
        society,
        role: selectedRole,
      },
    });
  };

  return (
    <View style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.authContent}>
        <View style={styles.authHeader}>
          <View style={styles.logoTile}>
            <Text style={styles.logoText}>G</Text>
          </View>

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
                  styles.inputWithIcon,
                  {
                    minHeight: 72,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.brown : colors.softCopper,
                    backgroundColor: isSelected
                      ? colors.selected
                      : colors.peach,
                    paddingHorizontal: 16,
                  },
                ]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: isSelected ? colors.brown : colors.ink,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {role.title}
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  >
                    {role.description}
                  </Text>
                </View>

                {isSelected && (
                  <Text
                    style={{
                      color: colors.brown,
                      fontSize: 22,
                      fontWeight: "700",
                    }}
                  >
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.primaryButton, styles.formButton]}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>

            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
