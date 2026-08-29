import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const roles = [
  {
    id: "resident",
    title: "User",
    description: "Resident of the society",
  },
  {
    id: "admin",
    title: "Society Admin",
    description: "Manage and administer the society",
  },
  {
    id: "maintenance",
    title: "Maintenance / Security",
    description: "Maintenance or security staff",
  },
];

export default function Role() {
  const router = useRouter();
  const { society } = useLocalSearchParams();

  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert("Select Role", "Please choose your role.");
      return;
    }

    router.push({
      pathname: "/details",
      params: {
        society: society as string,
        role: selectedRole,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you are associated with your society
          </Text>
        </View>

        <View style={styles.form}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleOption,
                selectedRole === role.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedRole(role.id)}
            >
              <View style={styles.roleContent}>
                <Text
                  style={[
                    styles.roleTitle,
                    selectedRole === role.id && styles.selectedText,
                  ]}
                >
                  {role.title}
                </Text>

                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>

              {selectedRole === role.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 28,
    paddingTop: 60,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 15,
  },

  backText: {
    color: "#6B3E2E",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 50,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#6B3E2E",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#A65D3B",
    marginTop: 8,
    textAlign: "center",
  },

  form: {
    width: "100%",
  },

  roleOption: {
    minHeight: 78,
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 14,
    backgroundColor: "#FFF8ED",
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedOption: {
    borderColor: "#A65D3B",
    backgroundColor: "#F8E4D3",
  },

  roleContent: {
    flex: 1,
  },

  roleTitle: {
    color: "#4E3025",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 5,
  },

  selectedText: {
    color: "#6B3E2E",
  },

  roleDescription: {
    color: "#8A6657",
    fontSize: 14,
  },

  checkmark: {
    color: "#A65D3B",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  continueButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  continueText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },
});
