import { SymbolView } from "expo-symbols";
import { Image, Pressable, Text, View } from "react-native";
import { colors, styles } from "../../styles/theme";

type Props = {
  name: string;
  apartment: string;
  society: string;
  onLogout: () => void;
};

export default function ResidentHeader({
  name,
  apartment,
  society,
  onLogout,
}: Props) {
  return (
    <>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Resident Home</Text>

          <Text style={styles.pageSubtitle}>{society.toUpperCase()}</Text>
        </View>

        <View style={styles.topActions}>
          <SymbolView
            name={{
              ios: "bell",
              android: "notifications_none",
              web: "notifications_none",
            }}
            tintColor={colors.ink}
            size={21}
          />

          <Pressable style={styles.homeMark} onPress={onLogout}>
            <SymbolView
              name={{
                ios: "rectangle.portrait.and.arrow.right",
                android: "logout",
                web: "logout",
              }}
              tintColor={colors.white}
              size={19}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.profileBanner}>
        <View style={styles.profileCopy}>
          <Text style={styles.bannerEyebrow}>RESIDENT PROFILE</Text>

          <Text numberOfLines={1} style={styles.greeting}>
            Good morning, {name}
          </Text>

          <View style={styles.addressLine}>
            <SymbolView
              name={{
                ios: "building.2",
                android: "business",
                web: "business",
              }}
              tintColor={colors.brown}
              size={15}
            />

            <Text style={styles.address}>
              Apartment {apartment} · {society}
            </Text>
          </View>
        </View>

        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri:
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(name) +
                "&background=FFE1D7&color=91441F",
            }}
            style={styles.avatar}
          />

          <View style={styles.onlineDot} />
        </View>
      </View>
    </>
  );
}
