import React, {useEffect, useRef, useState} from 'react';
import Icon from "react-native-vector-icons/AntDesign";
import {View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, FlatList} from 'react-native-style-shorthand';
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";

import {ICONS} from "../../constants";
import Text from '../CustomText/CustomText';
import withBottomSheet from '../BottomSheet';
import CommonTextInput from '../CommonTextInput.js/CommonTextInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SelectSheet =  withBottomSheet(({label, onSearch, options, onSelect, onClose, placeholder, requestToAddOption, onReachEnd= false, onReachEndThreshold=false, loadingMoreData=false, searchString="", align, searchKey=false, selectedOptions=[], clickedClose=false, isMultiSelect}: any) => {
  const [searchVal, setSearchVal] = useState("");

  const onSelectOption = (option: any) => {
    setSearchVal("");
    onSelect(option);
    onClose();
  };

  const insets= useSafeAreaInsets();

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

  const renderOption = ({ item, index }: any) => {
    return(
      <View bw={1} bc={'#8E8E8E'} br={8} ph={8} pv={5} mh={5} fd='row' ai='center'>
        <Text ftsz={12}>{item}</Text>
        <TouchableOpacity onPress={() => onSelect(item)} ml={10}>
          <Text ftsz={10}>X</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{...styles.container, paddingBottom: insets.bottom}}>
      <View p={24}>
        <Text w={'100%'} ta='center' weight="500" ftsz={16}>{label}</Text>
        <TouchableOpacity t={16} r={16} po='absolute' onPress={clickedClose}>
          <Icon color={'#000'} name="close" size={18} />
        </TouchableOpacity>
      </View>
      {isMultiSelect && <View mv={10} mh={20}>
        <FlatList 
          data={selectedOptions}
          renderItem={renderOption}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>}
      {onSearch && (
        <CommonTextInput
          style={styles.inputStyle}
          placeholder={placeholder}
          onChangeText={(t)=>{
            onSearch(t);
            setSearchVal(t);
          }}
          c={"black"}
          value={searchVal}
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
          initialNumToRender={25}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => (
            <>
            {index === 0 && <View bbw={0.4} bc="#8E8E8E"/>}
            {
              index ===0 && searchVal == '' && selectedOptions?.length>0 && Array.isArray(selectedOptions) && selectedOptions?.map((item)=>{
                return(
                <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
                  <View fd='row' ai='center' jc='space-between'>
                    <Text ftsz={12} weight='400' ta={align}>{item}</Text>
                    <View h={24}>
                      <ICONS.TickMark width={24} height={24}/>
                    </View>
                  </View>
                </TouchableOpacity>
                )
              })
            }
            {
              index === 0 && searchVal == '' && selectedOptions?.length>0 && typeof(selectedOptions) == "string" && 
              <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
                <View fd='row' ai='center' jc='space-between'>
                  <Text ftsz={12} weight='400' ta={align}>{selectedOptions}</Text>
                  <View h={24}>
                    {typeof(selectedOptions) == "string" && <ICONS.TickMark width={24} height={24}/>}
                  </View>
                </View>
              </TouchableOpacity>
            }
            {searchVal == "" ? typeof(selectedOptions) == "string" && selectedOptions!= item && <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
              <View fd='row' ai='center' jc='space-between'>
                <Text ftsz={12} weight='400' ta={align}>{item}</Text>
                <View h={24}>
                  {typeof(selectedOptions) == "object" && selectedOptions?.includes(item) && <ICONS.TickMark width={24} height={24}/>}
                  {typeof(selectedOptions) == "string" && selectedOptions === item && <ICONS.TickMark width={24} height={24}/>}
                </View>
              </View>
            </TouchableOpacity> : typeof(selectedOptions) == "string" && <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
              <View fd='row' ai='center' jc='space-between'>
                <Text ftsz={12} weight='400' ta={align}>{item}</Text>
                <View h={24}>
                  {typeof(selectedOptions) == "object" && selectedOptions?.includes(item) && <ICONS.TickMark width={24} height={24}/>}
                  {typeof(selectedOptions) == "string" && selectedOptions === item && <ICONS.TickMark width={24} height={24}/>}
                </View>
              </View>
            </TouchableOpacity>}
            {searchVal == "" ? typeof(selectedOptions) == "object" && !selectedOptions?.includes(item) && <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
              <View fd='row' ai='center' jc='space-between'>
                <Text ftsz={12} weight='400' ta={align}>{item}</Text>
                <View h={24}>
                  {typeof(selectedOptions) == "object" && selectedOptions?.includes(item) && <ICONS.TickMark width={24} height={24}/>}
                  {typeof(selectedOptions) == "string" && selectedOptions === item && <ICONS.TickMark width={24} height={24}/>}
                </View>
              </View>
            </TouchableOpacity> : typeof(selectedOptions) == "object" && <TouchableOpacity p={13} bbw={0.4} bc="#8E8E8E" onPress={() => onSelectOption(item)}>
              <View fd='row' ai='center' jc='space-between'>
                <Text ftsz={12} weight='400' ta={align}>{item}</Text>
                <View h={24}>
                  {typeof(selectedOptions) == "object" && selectedOptions?.includes(item) && <ICONS.TickMark width={24} height={24}/>}
                  {typeof(selectedOptions) == "string" && selectedOptions === item && <ICONS.TickMark width={24} height={24}/>}
                </View>
              </View>
            </TouchableOpacity>}
            </>
          )}
        />
        {loadingMoreData && <ActivityIndicator p={8} color={'#000'}/>}
        </>
      )}
    </View>
  );
});

const SelectInput = ({label, onSelect, disabled, isSelected, options, onSearch=false, value, placeholder, searchPlaceholder, snapPoints, requestToAddOption, renderInput, onReachEnd= false, onReachEndThreshold=false, loadingMoreData=false, searchString="", labelAlign="center", align="left", searchKey=false, selectedOptions=[], maxSelected=0}: any) => {
  const ref = useRef<BottomSheetModal>(null);
  const onPressSelect = () => {
    if(disabled){
      return
    }
    ref.current?.present();
  };

  const closeSheet = () => {
    onSearch && onSearch('');
    if(!maxSelected){
      ref.current?.dismiss();
    }
  };

  const clickedClose = ()=>{
    onSearch && onSearch('');
    ref.current?.dismiss();
  }


  return (
    <>
      {renderInput && renderInput({onPressSelect})}
      {!renderInput && (
        <View asf="stretch" gap={8}>
          <Text weight="500" lh={17} ftsz={12} c={isSelected ? "black" : "white"} ta={labelAlign}>{label}</Text>
          <TouchableOpacity
            fd="row"
            br={40}
            ph={16}
            w="100%"
            bw={0.5}
            ai="center"
            onPress={onPressSelect}
            bgc={isSelected ? "#fff" : "#000"}
            bc={isSelected ? "#fff" : "#8E8E8E"}
            style={[ disabled == true ? styles.disabledCss : {}]}
          >
            <Text
              f={1}
              pv={6}
              lh={17}
              ftsz={12}
              weight="400"
              c={isSelected ? "black" : "white"}>
                {value ? value : placeholder}
            </Text>
            <View
              pl={12}
              blw={0.5}
              jc="center"
              asf="stretch"
              bc="#8E8E8E"
            >
              <ICONS.ChevronDown />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <SelectSheet
        searchKey={searchKey}
        searchString={searchString}
        onReachEnd = {onReachEnd}
        onReachEndThreshold = {onReachEndThreshold}
        loadingMoreData={loadingMoreData}
        ref={ref}
        backdrop
        isMultiSelect={maxSelected > 0 ? true : false}
        label={label}
        options={options}
        onSelect={onSelect}
        onSearch={onSearch}
        onClose={closeSheet}
        snapPoints={snapPoints}
        placeholder={searchPlaceholder}
        requestToAddOption={requestToAddOption}
        align={align}
        clickedClose={clickedClose}
        selectedOptions={selectedOptions === false ? "" : selectedOptions}
      />
    </>
  );
};

SelectInput.defaultProps = {
  value: '',
  options: [],
  snapPoints: ['80%'],
  placeholder: 'Select',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    padding: 13,
    borderBottomWidth: 0.4,
    borderColor: '#8E8E8E',
  },
  disabledCss: {
    backgroundColor:'lightgray',
  }
});

export default SelectInput;
