import React, {FC, forwardRef, useCallback, useEffect, useState} from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native-style-shorthand';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { popNavigation } from '../../utils/navigationService';

const withBottomSheet = (Component: FC) =>
  forwardRef(
    (
      {snapPoints, backdrop, onCloseBottomSheet, ...rest}: {snapPoints?: string[]; [key: string]: any},
      ref: React.Ref<BottomSheetModalMethods>,
    ) => {

      const [isShowing, setIsShowing] = useState<boolean>(false);
      
      useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            if (isShowing) {
              ref && ref.current?.close();
              return true;
            } else if (!isShowing) {
              popNavigation();
              return true;
            }
          };
          BackHandler.addEventListener("hardwareBackPress", onBackPress);
          return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [ref, isShowing])
        );

      const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => {
        return (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
          />
        );
      };

      return (
        <BottomSheetModal
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          ref={ref}
          // style={styles.shadow}
          onChange={(idx) => {
            setIsShowing(idx < 0 ? false : true);
            }}
          handleComponent={null}
          snapPoints={snapPoints ?? ['85%']}
          onDismiss={() => onCloseBottomSheet && onCloseBottomSheet()}
          backgroundStyle={styles.backgroundStyle}
          backdropComponent={backdrop ? renderBackdrop : undefined}>
          <Component {...rest} />
        </BottomSheetModal>
      );
    },
  );

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  backgroundStyle: {
    backgroundColor: 'white',
    borderRadius: 35,
  },
});
export default withBottomSheet;
