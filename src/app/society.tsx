import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { colors as themeColors } from "../styles/theme";
import { societyStyles as styles } from "../styles/screens/society";

type SocietyOption = {
  id: string;
  name: string;
  city: string | null;
};

export default function Society() {
  const router = useRouter();

  const [selectedSociety, setSelectedSociety] = useState("");
  const [societies, setSocieties] = useState<SocietyOption[]>([]);
  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [societyError, setSocietyError] = useState("");

  const loadSocieties = useCallback(async () => {
    setLoadingSocieties(true);
    setSocietyError("");
    try {
      const { data, error } = await supabase
        .from("societies")
        .select("id, name, city")
        .order("city")
        .order("name");

      if (error) {
        setSocietyError(error.message);
        setSocieties([]);
        return;
      }

      setSocieties(data || []);
    } catch (error) {
      setSocietyError(
        error instanceof Error
          ? error.message
          : "Could not reach the society registry. Check your connection.",
      );
      setSocieties([]);
    } finally {
      setLoadingSocieties(false);
    }
  }, []);

  useEffect(() => {
    void loadSocieties();
  }, [loadSocieties]);

  const handleContinue = () => {
    if (!selectedSociety) {
      Alert.alert("Select Society", "Please choose your society.");
      return;
    }

    if (selectedSociety === "not-listed") {
      router.push("/contact");
      return;
    }

    const society = societies.find((item) => item.id === selectedSociety);
    if (!society) {
      Alert.alert(
        "Society unavailable",
        "Refresh the registry and select a society again.",
      );
      return;
    }

    router.push({
      pathname: "/role",
      params: {
        society: society.name,
        societyId: society.id,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.logoTile}>
          <SymbolView
            name={{
              ios: "door.left.hand.open",
              android: "door_open",
              web: "door_open",
            }}
            tintColor={colors.brown}
            size={32}
          />
        </View>
        <Text style={styles.eyebrow}>GATED LIVING</Text>
        <Text style={styles.title}>Choose Your Society</Text>
        <Text style={styles.subtitle}>
          Select your residential community to continue.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <SymbolView
            name={{ ios: "building.2", android: "business", web: "business" }}
            tintColor={colors.brown}
            size={22}
          />
          <Text style={styles.sectionTitle}>Residential Society</Text>
          <Text style={styles.residentialId}>Residential ID</Text>
        </View>

        <Text style={styles.label}>Registered Communities</Text>

        {loadingSocieties && (
          <View style={styles.feedback}>
            <ActivityIndicator color={colors.brown} />
            <Text style={styles.loadingText}>Loading registered societies...</Text>
          </View>
        )}

        {!loadingSocieties && societyError !== "" && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Couldn’t load societies</Text>
            <Text style={styles.emptyMessage}>{societyError}</Text>
            <TouchableOpacity
              onPress={() => void loadSocieties()}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loadingSocieties && !societyError && societies.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No societies registered</Text>
            <Text style={styles.emptyMessage}>
              Ask your society administrator to register your community, or
              request access below.
            </Text>
          </View>
        )}

        {societies.map((society) => (
          <TouchableOpacity
            key={society.id}
            style={[
              styles.societyOption,
              selectedSociety === society.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedSociety(society.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedSociety === society.id }}
          >
            <SymbolView
              name={{ ios: "building.2", android: "business", web: "business" }}
              tintColor={
                selectedSociety === society.id ? colors.brown : colors.muted
              }
              size={20}
            />
            <View style={styles.societyCopy}>
              <Text
                style={[
                  styles.societyText,
                  selectedSociety === society.id && styles.selectedText,
                ]}
              >
                {society.name}
              </Text>
              {!!society.city && (
                <Text style={styles.cityText}>{society.city}</Text>
              )}
            </View>

            {selectedSociety === society.id && (
              <SymbolView
                name={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
                tintColor={colors.brown}
                size={20}
              />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.societyOption,
            selectedSociety === "not-listed" && styles.selectedOption,
          ]}
          onPress={() => setSelectedSociety("not-listed")}
          accessibilityRole="radio"
          accessibilityState={{ selected: selectedSociety === "not-listed" }}
        >
          <SymbolView
            name={{
              ios: "questionmark.circle",
              android: "help_outline",
              web: "help_outline",
            }}
            tintColor={colors.muted}
            size={20}
          />
          <Text
            style={[
              styles.societyText,
              selectedSociety === "not-listed" && styles.selectedText,
            ]}
          >
            My society isn't listed
          </Text>

          {selectedSociety === "not-listed" && (
            <SymbolView
              name={{
                ios: "checkmark.circle.fill",
                android: "check_circle",
                web: "check_circle",
              }}
              tintColor={colors.brown}
              size={20}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
          <SymbolView
            name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
            tintColor={colors.white}
            size={20}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>
        Need help finding your community? Choose “My society isn’t listed”.
      </Text>
    </ScrollView>
  );
}

const colors = {
  background: themeColors.background,
  brown: themeColors.brown,
  ink: themeColors.ink,
  muted: themeColors.muted,
  peach: themeColors.peach,
  selected: themeColors.selected,
  white: themeColors.white,
};
