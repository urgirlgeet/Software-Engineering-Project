import { StyleSheet } from "react-native";

export const dashboardColors = {
  background: "#FFF9F7",
  brown: "#91441F",
  ink: "#24100A",
  muted: "#705E58",
  peach: "#FFF0EB",
  peachStrong: "#FFE1D7",
  white: "#FFFFFF",
  green: "#DFF3D9",
  greenText: "#28742D",
  red: "#FFE1E0",
  redText: "#C53B3B",
  yellow: "#FFF1BE",
  yellowText: "#9A6A00",
  border: "#F3E4DF",
};

export const dashboardStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: dashboardColors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: dashboardColors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: dashboardColors.brown,
    fontSize: 17,
  },

  container: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 84,
  },

  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  pageTitle: {
    color: dashboardColors.ink,
    fontFamily: "Georgia",
    fontSize: 20,
  },

  pageSubtitle: {
    color: dashboardColors.brown,
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 3,
  },

  topActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },

  homeMark: {
    alignItems: "center",
    backgroundColor: dashboardColors.brown,
    borderRadius: 20,
    height: 34,
    justifyContent: "center",
    width: 34,
  },

  profileBanner: {
    backgroundColor: dashboardColors.peach,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 113,
    padding: 19,
  },

  profileCopy: {
    flex: 1,
  },

  bannerEyebrow: {
    color: dashboardColors.brown,
    fontSize: 10,
    letterSpacing: 1.2,
  },

  greeting: {
    color: dashboardColors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    marginTop: 8,
  },

  addressLine: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },

  address: {
    color: dashboardColors.muted,
    flex: 1,
    fontSize: 13,
    marginLeft: 7,
  },

  avatarWrap: {
    height: 49,
    position: "relative",
    width: 49,
  },

  avatar: {
    borderRadius: 25,
    height: 49,
    width: 49,
  },

  onlineDot: {
    backgroundColor: dashboardColors.brown,
    borderColor: dashboardColors.peach,
    borderRadius: 7,
    borderWidth: 2,
    bottom: 0,
    height: 14,
    position: "absolute",
    right: -1,
    width: 14,
  },

  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
    marginTop: 25,
  },

  sectionTitleWrap: {
    alignItems: "center",
    flexDirection: "row",
  },

  sectionTitle: {
    color: dashboardColors.ink,
    fontFamily: "Georgia",
    fontSize: 20,
  },

  count: {
    backgroundColor: dashboardColors.peachStrong,
    borderRadius: 12,
    color: dashboardColors.brown,
    fontSize: 11,
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  sectionAction: {
    color: dashboardColors.brown,
    fontSize: 11,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  actionCard: {
    backgroundColor: dashboardColors.white,
    borderRadius: 11,
    minHeight: 116,
    padding: 14,
    width: "48.5%",
    shadowColor: dashboardColors.brown,
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
  },

  actionIcon: {
    alignItems: "center",
    backgroundColor: dashboardColors.peachStrong,
    borderRadius: 22,
    height: 39,
    justifyContent: "center",
    width: 39,
  },

  actionTitle: {
    color: dashboardColors.ink,
    fontSize: 16,
    marginTop: 12,
  },

  actionDetail: {
    color: dashboardColors.muted,
    fontSize: 11,
    marginTop: 4,
  },

  requestCard: {
    backgroundColor: dashboardColors.white,
    borderRadius: 11,
    marginBottom: 11,
    padding: 14,
  },

  requestShortcut: {
    alignItems: "center",
    backgroundColor: dashboardColors.peach,
    borderRadius: 9,
    flexDirection: "row",
    marginBottom: 11,
    padding: 12,
  },

  requestShortcutText: {
    color: dashboardColors.brown,
    flex: 1,
    fontSize: 13,
    marginLeft: 9,
  },

  requestShortcutArrow: {
    color: dashboardColors.brown,
    fontSize: 20,
  },

  requestHeader: {
    alignItems: "center",
    flexDirection: "row",
  },

  category: {
    color: dashboardColors.brown,
    fontSize: 10,
    letterSpacing: 1,
  },

  separator: {
    color: dashboardColors.muted,
    marginHorizontal: 6,
  },

  requestDate: {
    color: dashboardColors.muted,
    fontSize: 11,
  },

  priority: {
    backgroundColor: dashboardColors.red,
    borderRadius: 12,
    color: dashboardColors.redText,
    fontSize: 10,
    marginLeft: "auto",
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  mediumPriority: {
    backgroundColor: dashboardColors.yellow,
    color: dashboardColors.yellowText,
  },

  lowPriority: {
    backgroundColor: dashboardColors.peach,
    color: dashboardColors.ink,
  },

  requestTitle: {
    color: dashboardColors.ink,
    fontSize: 17,
    marginTop: 9,
  },

  requestFooter: {
    backgroundColor: dashboardColors.peach,
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    padding: 9,
  },

  statusText: {
    color: dashboardColors.muted,
    fontSize: 10,
  },

  requestAction: {
    color: dashboardColors.brown,
    fontSize: 10,
  },

  bottomNav: {
    backgroundColor: dashboardColors.white,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    left: 0,
    paddingBottom: 11,
    paddingTop: 12,
    position: "absolute",
    right: 0,
  },

  navItem: {
    alignItems: "center",
    gap: 4,
  },

  navLabel: {
    color: dashboardColors.ink,
    fontSize: 10,
  },

  activeNavLabel: {
    color: dashboardColors.brown,
  },
});
