import { Text, View } from "react-native";
import { styles } from "../../styles/theme";

type Props = {
  title: string;
  count?: string;
  action?: string;
};

export default function SectionHeading({ title, count, action }: Props) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count && <Text style={styles.count}>{count}</Text>}
      </View>

      {action && <Text style={styles.sectionAction}>{action}</Text>}
    </View>
  );
}
