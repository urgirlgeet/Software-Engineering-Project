import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { complaintCategories } from "../constants/complaints";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

export default function CreateComplaint() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "urgent">(
    "normal",
  );

  const handleSubmit = () => {
    Alert.alert(
      "Complaint",
      "The complaint submission will be connected to Supabase in the next step.",
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView
        contentContainerStyle={commonStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              fontSize: 28,
              color: colors.text,
              marginBottom: 20,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text style={commonStyles.title}>New Complaint</Text>

        <Text
          style={[commonStyles.subtitle, { marginTop: 6, marginBottom: 24 }]}
        >
          Tell us about the issue in your community.
        </Text>

        <View style={commonStyles.card}>
          {/* Title */}
          <Text style={commonStyles.label}>Complaint Title</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Water leakage in bathroom"
            placeholderTextColor={colors.textMuted}
            style={[commonStyles.input, { marginBottom: 20 }]}
          />

          {/* Category */}
          <Text style={commonStyles.label}>Category</Text>

          <View style={{ marginBottom: 20 }}>
            {complaintCategories.map((item) => {
              const selected = category === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setCategory(item)}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginBottom: 8,
                    backgroundColor: selected ? colors.primary : colors.input,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: selected ? "600" : "400",
                      color: selected ? colors.white : colors.text,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Location */}
          <Text style={commonStyles.label}>Location</Text>

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Block A, Lift 2"
            placeholderTextColor={colors.textMuted}
            style={[commonStyles.input, { marginBottom: 20 }]}
          />

          {/* Description */}
          <Text style={commonStyles.label}>Description</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            style={[
              commonStyles.input,
              {
                height: 130,
                paddingTop: 16,
                marginBottom: 20,
              },
            ]}
          />

          {/* Priority */}
          <Text style={commonStyles.label}>Priority</Text>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {(["low", "normal", "urgent"] as const).map((item) => {
              const selected = priority === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setPriority(item)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: selected
                      ? item === "urgent"
                        ? colors.urgent
                        : colors.primary
                      : colors.input,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? colors.white : colors.text,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Image */}
          <Text style={commonStyles.label}>Photo</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Add Photo",
                "Image picker will be connected in the next step.",
              )
            }
            style={{
              height: 110,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.input,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.primary,
              }}
            >
              + Attach Photo
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontSize: 13,
                color: colors.textMuted,
              }}
            >
              Add a photo of the issue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.primaryButton}
            onPress={handleSubmit}
          >
            <Text style={commonStyles.primaryButtonText}>Submit Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
