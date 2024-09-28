import React, { useState } from "react";
import { Text } from "..";
import { View, TouchableOpacity } from "react-native-style-shorthand";
import { ICONS } from "../../constants";

const Rating = props => {
  const data = ["Star1", "Star2", "Star1", "Star2", "Hello"];
  const { answerVal = [], updateAnswer, questionIndex, questionText } = props;
  const [selectedStars, setSelectedStars] = useState(0);

  const onPressStar = index => {
    setSelectedStars(index);
    updateAnswer({ question_id: questionIndex, question_text: questionText, stars: index });
  };

  const renderStars = () => {
    return (
      <>
        {data?.map((item, index) => {
          return (
              <TouchableOpacity style={{paddingRight: 4}}
                key={index.toString()}
                onPress={() => {
                  onPressStar(index + 1);
                }}>
                {selectedStars ? (
                   (index+1) > selectedStars ? <ICONS.Star
                    width={25}
                    height={25}
                    fill={
                      "#D9D9D9"
                    }
                  /> : <ICONS.Star
                  width={25}
                  height={25}
                  fill={
                   "#F6CA53"
                  }
                /> 
                ) : (
                  <ICONS.Star
                    width={25}
                    height={25}
                    fill={
                      "#D9D9D9"
                    }
                  />
                )}
              </TouchableOpacity>
          );
        })}
      </>
    );
  };
  return (
    <View pv={8} f={1} jc="center">
      <Text ftsz={14} weight="500">{questionText}</Text>
      <View mt={4} fd="row">{renderStars()}</View>
    </View>
  );
};

export default Rating;
