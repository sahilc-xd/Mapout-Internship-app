import NetworkLogger from 'react-native-network-logger';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native-style-shorthand';

const NetworkLogs = () => {

    const insets = useSafeAreaInsets();

    return(
        <View pt={insets.top} f={1} pb={insets.bottom}>
            <NetworkLogger theme="dark" />
        </View>
    );
};

export default NetworkLogs;