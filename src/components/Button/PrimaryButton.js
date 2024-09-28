import { ActivityIndicator } from "react-native";
import { TouchableOpacity, Text } from "react-native";

const PrimaryButton = ({
  text,
  bgStyle,
  textStyle,
  isDisabled,
  handleAction,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      style={bgStyle}
      disabled={isDisabled}
      onPress={handleAction}>
      <Text style={textStyle}>
        {isLoading ? <ActivityIndicator color={"#fff"} /> : text}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
