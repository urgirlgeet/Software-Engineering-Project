import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../styles/theme";

type DropdownProps = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  formatOption?: (option: string) => string;
};

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  formatOption = (option) => option,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const select = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? formatOption(value) : placeholder}`}
        onPress={() => setOpen(true)}
        style={styles.field}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? formatOption(value) : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(option) => option}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => select(item)}
                    style={[styles.option, selected && styles.optionSelected]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {formatOption(item)}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: 13,
  },
  value: {
    color: colors.ink,
    fontSize: 16,
  },
  placeholder: {
    color: colors.placeholder,
    fontSize: 16,
  },
  chevron: {
    color: colors.muted,
    fontSize: 16,
  },
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(23, 43, 58, 0.45)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: "70%",
    paddingVertical: 12,
    width: "100%",
    maxWidth: 360,
  },
  sheetTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
    paddingBottom: 8,
    paddingHorizontal: 18,
  },
  option: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  optionSelected: {
    backgroundColor: colors.peach,
  },
  optionText: {
    color: colors.ink,
    fontSize: 16,
  },
  optionTextSelected: {
    color: colors.brown,
    fontWeight: "700",
  },
});
