import { StyleSheet } from "react-native";
import { COLORS, FONT, WEIGHT } from "../../constants/index";

const styles = StyleSheet.create({
  inputStyle: {
    width: 40,
    height: 40,
    borderWidth: 0.75,
    textAlign: "center",
    borderColor: COLORS.themeColor2,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    color : COLORS.black
  },
});

export default styles;
