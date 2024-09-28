import React, { useState } from "react";
import { Text, TextInput } from "..";
import { FlatList, TouchableOpacity, View } from "react-native-style-shorthand";
import { ICONS } from "../../constants";

const OptionsVertical = (props) => {
  const { answerVal = [], updateAnswer, questionIndex, options=[] } = props;
  const [ans, setAns] = useState(answerVal);
  const [textValue, setTextValue] = useState("")

  const onPressOption = (opt) => {
    const x = answerVal;
    x[questionIndex] = opt;
    setAns(x);
    updateAnswer(x);
  };

  const renderOptions = () => {
    return (
      <>
        <FlatList
            data={options}
            style={{marginVertical: 8}}
            keyExtractor={(item,index)=> index.toString()}
            renderItem={({item, index})=>{
                return (
                    <TouchableOpacity onPress={()=>{
                        onPressOption(item)
                    }} f={1} asf="flex-start" bw={1} jc="center" mh={4} mv={4} br={20} bgc={ans?.[questionIndex] === item ? '#F6CA53' : '#FFF'}>
                        <Text numberOfLines={1} adjustsFontSizeToFit ftsz={13} weight="400" ph={16} pv={4}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )
            }}
        />
      </>
    );
  };
  return (
    <View pv={8} f={1} jc="center">
      <Text ftsz={14} weight="500">Which feature do you intend to use the most?</Text>
      {renderOptions()}
      <TextInput value={textValue} onChangeText={(e)=>{
        const x = answerVal;
        x[questionIndex] = e;
        setAns(x);
        updateAnswer(x);
        setTextValue(e);
      }} asf="flex-start" bw={1} jc="center" ph={8} mh={4} multiline br={20} placeholder="Other (Type here)"/>
    </View>
  );
};

export default OptionsVertical;
