import { TouchableOpacity } from 'react-native';
import React from 'react';
import { ICONS } from '../constants';
import { Text } from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native-style-shorthand';
import { useAppSelector } from '../redux';
import { SvgUri } from 'react-native-svg';

export default function MyTabBar(props) {
  const {state, descriptors, navigation} = props;
  const home = useAppSelector(state=>state.home);

  const insets= useSafeAreaInsets();
  return (
    <View style={{ flexDirection: 'row', backgroundColor : 'rgba(255,255,255,0.90)', position: 'absolute', bottom: 0, marginBottom: insets.bottom , width:'100%', borderTopWidth:0.2, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingVertical: 12, borderColor:'rgba(210,215,215,0.5)', paddingHorizontal: 32}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        let routeName;

        const icons =()=>{
            switch(label){
                case 'Dashboard':{
                  routeName = "CareerWise"
                    return(
                        <>
                        {!isFocused ?  <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327478.svg'} width={24} height={24}/> : <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327479.svg'} width={24} height={24}/>}
                        </>
                    )
                }
                case 'Coaching':{
                  routeName = "Coaching"
                  return(
                      <>
                      {!isFocused ?  <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327474.svg'} width={24} height={24}/> : <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327479.svg'} width={24} height={24}/>}
                      </>
                  )
                }
                case 'Jobs':{
                  routeName = "Jobs"
                  return(
                    <>
                    {!isFocused ?  <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327474.svg'} width={24} height={24}/> : <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327477.svg'} width={24} height={24}/>}
                    </>
                  )
                } 
                case 'Feed':{
                  routeName = "Feed"
                  return(
                    <>
                    {!isFocused ?  <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327422.svg'} width={24} height={24}/> : <SvgUri uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Group%202087327476.svg'} width={24} height={24}/>}
                    </>
                  )
                } 
            }
        }


        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, flex:1}}
          >
              <View style={{alignItems: 'center', justifyContent: 'center', flex:1, width:'100%'}}>
                <View style={{justifyContent:'flex-end', alignItems: 'center', flex:2.5, marginBottom: 4}}>
                    {icons()}
                </View>
                {home?.newJobsCount>0 && label === "Jobs" && <View po='absolute' bgc={'#FFD439'} t={-8} r={8} h={25} w={25} jc='center' ai='center' p={4} br={100}><Text ftsz={8}>{home?.newJobsCount}+</Text></View>}
                <View style={{justifyContent: 'flex-start', alignItems: 'center', flex:1.5}}>
                </View>
              </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}