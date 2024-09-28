import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/index"; 

const styles = StyleSheet.create({
  inputStyle: {
    width: "100%",
    height: 40,
    borderWidth: 0.75,
    borderColor: COLORS.themeColor2,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    color : COLORS.black
  },
});

export default styles;
