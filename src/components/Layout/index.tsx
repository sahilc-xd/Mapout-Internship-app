import React from 'react';
import {View, Image} from 'react-native-style-shorthand';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Layout = ({headerColor, headerImage, containerStyle, children, topContainerHeightPercent, renderHeader, backgroundColor}: any) => {
  const insets = useSafeAreaInsets();
  const bottomContainerHeight = `${100 - topContainerHeightPercent}%`;

  return (
    <View f={1} bgc={backgroundColor}>
      <View
        bblr={50}
        jc="center"
        ai="center"
        pt={insets.top}
        bgc={headerColor}
        h={`${topContainerHeightPercent}%`}
      >
        {headerImage && (<Image source={headerImage} style={{ height:'100%', width:'100%' }} resizeMode='contain' />)}
        {renderHeader && renderHeader()}
      </View>
      <View bgc={headerColor} h={bottomContainerHeight}>
        <View
          f={1}
          btrr={50}
          bgc={backgroundColor}
          style={containerStyle ?? {}}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

Layout.defaultProps = {
  renderHeader: null,
  backgroundColor: 'black',
  topContainerHeightPercent: 30,
};

export default Layout;
