import React from "react";
import Codepush from 'react-native-code-push'

const CODE_PUSH_OPTIONS = {
    checkFrequency: Codepush.CheckFrequency.ON_APP_START,
    installMode: Codepush.InstallMode.ON_NEXT_RESTART,
}

const withCodePush = WrappedComponent => {
    class WrappedApp extends React.PureComponent {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <WrappedComponent />
                )
            }
    }

    return Codepush(CODE_PUSH_OPTIONS)(WrappedApp);
}

export default withCodePush;