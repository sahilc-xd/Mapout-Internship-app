import React, {useEffect, useRef} from 'react';
import Icon from "react-native-vector-icons/AntDesign";
import {View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native-style-shorthand';
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";

import Text from '../CustomText/CustomText';
import withBottomSheet from '../BottomSheet';
import CommonTextInput from '../CommonTextInput.js/CommonTextInput';

const SelectSheet = withBottomSheet(({label, onSearch, options, onSelect, onClose, placeholder, requestToAddOption, onReachEnd, onReachEndThreshold, loadingMoreData=false, searchKey=false, searchString=""}: any) => {
  const onSelectOption = (option: any) => {
    onSelect(option);
    onClose();
  };

  useEffect(()=>{
    return ()=>{
      onClose();
    }
  },[])

  let updatedOptions = options
  const isStringInArray=(search, options)=>{
    // Convert both the target string and the strings in the array to lowercase for a case-insensitive search
    const stringLower = search.toLowerCase();
    const arrayLower = options.map(item => item.toLowerCase());

    // Check if the lowercase version of the string exists in the lowercase version of the array
    return arrayLower.includes(stringLower);
  }

  if(searchKey?.length>0){
    if(!isStringInArray(searchKey, options)){
      updatedOptions=[searchKey,...updatedOptions];
    }
  }

  
  return (
    <View style={styles.container}>
      <View p={24} fd="row" jc="space-between">
        <Text weight="500" ftsz={14} lh={21.4}>{label}</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={18} />
        </TouchableOpacity>
      </View>
      {onSearch && (
        <CommonTextInput
          autoFocus
          onChangeText={onSearch}
          style={styles.inputStyle}
          placeholder={placeholder}
          c={"black"}
        />
      )}
      {requestToAddOption && updatedOptions.length === 0 && (
        <View ph={36} pv={12} ai="center">
          {requestToAddOption.isSuccess ? (
            <Text weight="400" ftsz={11} lh={17} ta="center">{requestToAddOption.successText}</Text>
          ) : (
            <>
              <Text weight="400" ftsz={11} lh={17} ta="center">{requestToAddOption.title}</Text>
              <TouchableOpacity onPress={()=>requestToAddOption.onPressAdd(searchString)} pv={12} mt={12} bgc={"#000"} asf="stretch" ai="center" br={8} disabled={requestToAddOption.isLoading}>
                {requestToAddOption.isLoading && <ActivityIndicator color="#fff" />}
                {!requestToAddOption.isLoading && <Text c={"#fff"} ftsz={12} weight="700">{requestToAddOption.buttonLabel}</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {(!requestToAddOption || updatedOptions.length > 0) && (
        <>
        <BottomSheetFlatList
          onEndReachedThreshold={onReachEndThreshold}
          onEndReached={onReachEnd}
          data={updatedOptions}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}: {item: string}) => (
            <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        {loadingMoreData && <ActivityIndicator p={8} color={'#000'}/>}
        </>
      )}
    </View>
  );
});

const SearchInput = ({label, onSelect, disabled, isSelected, hideSearch, setSearchLanguage, options, onSearch, value, placeholder, searchPlaceholder, snapPoints, labelStyle, inputStyle, labelContainer, requestToAddOption, onReachEnd= false, onReachEndThreshold=false, loadingMoreData=false, valueColor='#000', onClear=false, searchKey=false, searchString="", searchIconColor='#000'}: any) => {
  const ref = useRef<BottomSheetModal>(null);
  const onPressSelect = () => {
    if(disabled){
      return
    }
    ref.current?.present();
    // setSearchLanguage("")
  };

  const closeSheet = () => {
    if (onSearch) {
      onSearch('');
    }
    ref.current?.dismiss();
  };

  return (
    <>
      <View asf="stretch" gap={7}>
        {!onClear && <View style={[labelContainer]}>
          <Text ftsz={12} weight="500" style={[styles.label, labelStyle]}>{label}</Text>
        </View>}
        {onClear && <View style={{flexDirection: 'row', justifyContent:'space-between', ...[labelContainer]}}>
          <Text ftsz={12} weight="500" style={[styles.label, labelStyle]}>{label}</Text>
          <TouchableOpacity onPress={onClear}>
            <Text ftsz={12} weight="500" style={[styles.label, labelStyle]}>Clear</Text>
          </TouchableOpacity>
        </View>}
        <TouchableOpacity
          onPress={onPressSelect}
          style={[styles.input, value ? styles.selectedInput : {}, inputStyle, disabled==true ? styles.disabledCss : {}]}
        >
          {!value && !hideSearch && <Icon name="search1" size={12} color={searchIconColor} />}
          <Text
            pv={6}
            pl={5}
            lh={17}
            ftsz={12}
            weight="400"
            c={valueColor}>
              {value ? value : placeholder}
          </Text>
        </TouchableOpacity>
      </View>
      <SelectSheet
        searchKey={searchKey}
        onReachEnd = {onReachEnd}
        onReachEndThreshold = {onReachEndThreshold}
        loadingMoreData={loadingMoreData}
        ref={ref}
        backdrop
        searchString={searchString}
        label={label}
        options={options}
        onSelect={onSelect}
        onSearch={onSearch}
        onClose={closeSheet}
        snapPoints={snapPoints}
        placeholder={searchPlaceholder}
        requestToAddOption={requestToAddOption}
      />
    </>
  );
};

SearchInput.defaultProps = {
  value: '',
  options: [],
  labelStyle: {},
  hideSearch: false,
  snapPoints: ['80%'],
  showRightIcon: true,
  showLeftIcon: false,
  placeholder: 'Select',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    lineHeight: 17,
  },
  input: {
    flexDirection: "row",
    borderRadius: 40,
    paddingHorizontal: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#8E8E8E",
  },
  selectedInput: {
    backgroundColor: "#FFF6C6",
  },
  inputStyle: {
    padding: 13,
    borderBottomWidth: 1,
    borderColor: '#8E8E8E',
  },
  disabledCss: {
    backgroundColor:'lightgray',
  }
});

export default SearchInput;
