import { useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";

import { supabase } from "../../lib/supabase";
import { dashboardColors, dashboardStyles } from "../../styles/dashboardStyles";

type AssignComplaintModalProps = {
  visible: boolean;
  complaintId: string | null;
  societyId: string;
  onClose: () => void;
  onAssigned: () => void;
};

export default function AssignComplaintModal({
  visible,
  complaintId,
  societyId,
  onClose,
  onAssigned,
}: AssignComplaintModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const assignComplaint = async () => {
    if (!employeeId.trim()) {
      Alert.alert("Required", "Enter the maintenance employee ID.");
      return;
    }

    if (!complaintId) {
      return;
    }

    try {
      setAssigning(true);

      const { data: employee, error: employeeError } = await supabase
        .from("users")
        .select("id, name, employee_id")
        .eq("employee_id", employeeId.trim())
        .eq("society_id", societyId)
        .eq("role", "maintenance")
        .single();

      if (employeeError || !employee) {
        Alert.alert(
          "Employee not found",
          "No maintenance employee with this ID was found in your society.",
        );
        return;
      }

      const { error: updateError } = await supabase
        .from("complaints")
        .update({
          assigned_to: employee.id,
          status: "assigned",
        })
        .eq("id", complaintId);

      if (updateError) {
        Alert.alert("Error", updateError.message);
        return;
      }

      Alert.alert("Complaint Assigned", `Assigned to ${employee.name}.`);

      setEmployeeId("");
      onAssigned();
      onClose();
    } catch {
      Alert.alert("Error", "Unable to assign the complaint.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View style={[dashboardStyles.requestCard, { padding: 20 }]}>
          <Text style={dashboardStyles.sectionTitle}>Assign Complaint</Text>

          <Text style={[dashboardStyles.statusText, { marginTop: 8 }]}>
            Enter the maintenance employee ID.
          </Text>

          <TextInput
            value={employeeId}
            onChangeText={setEmployeeId}
            placeholder="Employee ID"
            placeholderTextColor={dashboardColors.muted}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: dashboardColors.border,
              borderRadius: 9,
              paddingHorizontal: 12,
              paddingVertical: 11,
              marginTop: 16,
              color: dashboardColors.ink,
              backgroundColor: dashboardColors.peach,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 16,
            }}
          >
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 9,
                alignItems: "center",
                backgroundColor: dashboardColors.peach,
              }}
            >
              <Text style={{ color: dashboardColors.brown }}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={assignComplaint}
              disabled={assigning}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 9,
                alignItems: "center",
                backgroundColor: dashboardColors.brown,
              }}
            >
              <Text style={{ color: dashboardColors.white }}>
                {assigning ? "Assigning..." : "Assign"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
