import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT } from '../../theme';
import { ICONS } from '../../constants';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error });
    // You can also log the error to a logging service here
  }

  refreshApp = () => {
    this.setState({ hasError: false, error: null });
  };

  onPressChatWithUs = () => {
    Linking.openURL('mailto:support@mapout.com');
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 64, backgroundColor: COLORS.white}}>
          <ICONS.ErrorBoundaryIcon />
            <TouchableOpacity style={{width: '100%', marginTop: 24}} onPress={()=>{
               this.refreshApp();
            }}>
              <LinearGradient colors={["#5980FF","#A968FD"]} useAngle={true} angle={135} angleCenter={{x:0.5,y:0.5}} style={{width: '100%',alignItems: 'center', borderRadius: 10}}>
                <Text style={{fontSize: 16, fontFamily: FONT.Bold, color: COLORS.white, paddingVertical: 20}}>Refresh</Text>
              </LinearGradient>
            </TouchableOpacity>
          <Text style={{fontSize: 18, fontFamily: FONT.SemiBold, color: COLORS.black, marginTop: 32, textAlign: 'center'}}>Sorry, we missed hitting the bull’s eye this time!</Text>
          <Text style={{fontSize: 18, fontFamily: FONT.SemiBold, color: COLORS.black, marginTop: 16}}>Please refresh.</Text>
          <View style={{flexDirection: 'row', marginTop: 24}}>
            <Text style={{fontSize: 14, fontFamily: FONT.SemiBold, color: COLORS.black}}>Need more help? </Text>
            <TouchableOpacity onPress={()=>{
              this.onPressChatWithUs();
            }}>
              <Text style={{fontSize: 14, fontFamily: FONT.SemiBold, color: COLORS.black, textDecorationLine: 'underline'}}>Reach out to us</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return this.props?.children;
  }
}

export default ErrorBoundary;
