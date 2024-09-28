import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native-style-shorthand';
import {useWindowDimensions} from 'react-native';

import {Text} from '../../components';

const Option = ({isSelectflow=false, title, onPress, isSelected=false, bgc="#fff", textColor="black", fontSize="11", pvSize=6}: any) => {

  const { width } = useWindowDimensions();

  return (
    <TouchableOpacity
      pv={pvSize}
      br={40}
      ph={13}
      bw={0.4}
      mnw={160}
      w={isSelectflow ? width-48 : 200}
      onPress={onPress}
      bgc={isSelected ? bgc : "#000"}
      bc={isSelected ? "#fff" : "#8E8E8E"}>
      <Text
        ftsz={fontSize}
        ta="center"
        weight="400"
        c={isSelected ? textColor : "white"}>
          {title}
      </Text>
    </TouchableOpacity>
  );
};

interface SelectProps {
  options: Array<{title: string, value: string, description?: string}>;
  onSelect: (value: string) => void;
}

const Select = ({options, onSelect, flow=false, isSelectflow=false, bgc, textColor, fontSize, pvSize}: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState('');

  const onSelectOption = (option: any) => {
    onSelect(option);
    setSelectedOption(option);
  };

  return (
    <>
      {options.map((option) => (
        <View ai="center" key={option.value}>
          <Option
            isSelectflow={isSelectflow}
            title={option.title}
            value={option.value}
            onPress={() => onSelectOption(option.value)}
            isSelected={selectedOption === option.value}
            bgc={bgc}
            textColor={textColor}
            fontSize={fontSize}
            pvSize={pvSize}
          />
          
          {!!(option?.description) ? (
            <View h={60} pv={8} jc='center'>
            {!!(flow === option?.value) && 
                <Text ta="center" weight="500" ftsz={12} c={"#d9d9d9"}>
                  {option?.description}
                </Text>
            }
            </View>
          ) : <View mt={12}></View>}
         
        </View>
      ))}
    </>
  );
};

export default Select;
