import React, { useEffect, useState } from "react";
import { Text, TextInput } from "..";
import { FlatList, TouchableOpacity, View } from "react-native-style-shorthand";
import { ICONS } from "../../constants";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const TextAnswer = (props) => {
  const { answerVal = [], updateAnswer, questionIndex, questionText } = props;
  const [textValue, setTextValue] = useState("");

  // useEffect(()=>{
  //   const x = answerVal;
  //   x[questionIndex] = textValue;
  //   setAns(x);
  //   // updateAnswer({ question_id: questionIndex, question_text: questionText, answer_text: textValue });
  // },[textValue])

  handleTextChange = (e) => {
    setTextValue(e);
    updateAnswer({ question_id: questionIndex, question_text: questionText, answer_text: e })
  }

  return (
    <View pv={8} f={1} jc="center">
      <Text ftsz={14} weight="500">{questionText}</Text>
      <TextInput maxLength={800} multiline={true} value={textValue} placeholder="Type here..." style={{borderWidth:1, borderRadius: 20, marginTop: 8, paddingHorizontal: 8, height:100}} numberOfLines={4} onChangeText={handleTextChange}/>
    </View>
  );
};

export default TextAnswer;
