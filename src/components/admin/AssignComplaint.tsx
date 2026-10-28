import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";

import { supabase } from "../../lib/supabase";
import { dashboardColors, dashboardStyles } from "../../styles/dashboardStyles";

type AssignComplaintModalProps = {
  visible: boolean;
  complaintId: string | null;
  societyId: string;
  onClose: () => void;
  onAssigned: () => void;
};

type MaintenanceStaff = {
  id: string;
  name: string;
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
  const [employees, setEmployees] = useState<MaintenanceStaff[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, name")
          .eq("society_id", societyId)
          .eq("role", "maintenance")
          .order("name");

        if (error) {
          Alert.alert("Unable to load staff", error.message);
          setEmployees([]);
        } else {
          setEmployees(data || []);
        }
      } catch {
        Alert.alert("Unable to load staff", "Please try again.");
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [societyId, visible]);

  const assignComplaint = async () => {
    if (!employeeId) {
      Alert.alert("Required", "Select a maintenance employee.");
      return;
    }

    if (!complaintId) {
      return;
    }

    try {
      setAssigning(true);

      const employee = employees.find((item) => item.id === employeeId);
      if (!employee) {
        Alert.alert(
          "Employee unavailable",
          "Select an available maintenance employee and try again.",
        );
        return;
      }

      const { data, error: updateError } = await supabase
        .from("complaints")
        .update({
          assigned_to: employeeId,
          status: "assigned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", complaintId)
        .eq("society_id", societyId)
        .select("id")
        .single();

      if (updateError || !data) {
        Alert.alert(
          "Unable to assign complaint",
          updateError?.message || "The complaint was not updated.",
        );
        return;
      }

      Alert.alert(
        "Complaint Assigned",
        `Assigned to ${employee?.name || "the selected employee"}.`,
      );

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
            Choose a maintenance employee from your society.
          </Text>

          <ScrollView
            style={{ maxHeight: 240, marginTop: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            {loadingEmployees ? (
              <Text style={dashboardStyles.statusText}>Loading staff...</Text>
            ) : employees.length === 0 ? (
              <Text style={dashboardStyles.statusText}>
                No maintenance employees are available in this society.
              </Text>
            ) : (
              employees.map((employee) => (
                <Pressable
                  key={employee.id}
                  onPress={() => setEmployeeId(employee.id)}
                  style={{
                    backgroundColor:
                      employeeId === employee.id
                        ? dashboardColors.peach
                        : dashboardColors.white,
                    borderColor: dashboardColors.border,
                    borderRadius: 9,
                    borderWidth: 1,
                    marginTop: 8,
                    padding: 12,
                  }}
                >
                  <Text style={{ color: dashboardColors.ink }}>
                    {employee.name}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>

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
              disabled={
                assigning || loadingEmployees || employees.length === 0
              }
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
