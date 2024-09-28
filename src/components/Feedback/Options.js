import React, { useState } from "react";
import { Text } from "..";
import { FlatList, TouchableOpacity, View } from "react-native-style-shorthand";
import { ICONS } from "../../constants";

const Options = (props) => {
  const { answerVal = [], updateAnswer, questionIndex, options=[], questionText } = props;
  const [selectedOption, setSelectedOption] = useState(null);

  const onPressOption = (id, text) => {
    setSelectedOption(id);
    updateAnswer({ question_id: questionIndex, question_text: questionText, optionText: text, option_id: id });
  };

  const renderOptions = () => {
    return (
      <>
        <FlatList
            data={options}
            style={{marginTop: 8}}
            numColumns={2}
            keyExtractor={(item,index)=> index.toString()}
            renderItem={({item, index})=>{
                return (
                    <TouchableOpacity onPress={()=>{
                        onPressOption(item._id, item.optionText)
                    }} f={1} bw={1} jc="center" ai="center" mh={4} mv={4} br={20} bgc={selectedOption === item._id ? '#F6CA53' : '#FFF'}>
                        <Text numberOfLines={1} adjustsFontSizeToFit ftsz={13} weight="400" ph={4} pv={4}>
                            {item.optionText}
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
      <Text ftsz={14} weight="500">{questionText}</Text>
      {renderOptions()}
    </View>
  );
};

export default Options;
