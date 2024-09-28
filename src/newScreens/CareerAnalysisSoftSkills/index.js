import React, { useEffect } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { popNavigation } from "../../utils/navigationService";
import { Text } from "../../components";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import { Alert } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const SkillButton = ({ title, color, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    bw={1}
    bc={color}
    pv={6}
    mr={8}
    ph={13}
    bgc={isSelected ? color : "transparent"}
    br={40}>
    <Text
      c={'#000'}
      ftsz={10}
      weight={"400"}>
      {title}
    </Text>
  </TouchableOpacity>
);

const CareerAnalysisSoftSKills = props => {
  const desires_aspirations = props?.route?.params?.aspirations || [];
  const user_id = useAppSelector(state => state.user.user_id);
  const [commSkill, setCommSkill] = React.useState("");
  const [timeSkill, setTimeSkill] = React.useState("");
  const [leadershipSkill, setLeadershipSkill] = React.useState("");
  const [adaptabilitySkill, setAdaptabilitySkill] = React.useState("");
  const [problemSkill, setProblemSkill] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);

  const [saveSkillAssessment, { isLoading, isSuccess, isError, error }] =
    api.useSkillAssessmentMutation();

  React.useEffect(() => {
    if (
      commSkill &&
      timeSkill &&
      leadershipSkill &&
      adaptabilitySkill &&
      problemSkill
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [commSkill, timeSkill, leadershipSkill, adaptabilitySkill, problemSkill]);

  const onPressNext = () => {
    const data = {
      user_id,
      desires_aspirations,
      assessment: {
        communication_skill: commSkill,
        timeManagement_skill: timeSkill,
        leadership_skill: leadershipSkill,
        adaptability_skill: adaptabilitySkill,
        problemSolving_skill: problemSkill,
      },
    };
    saveSkillAssessment(data);
  };

  useEffect(() => {
    if (isSuccess) {
      logAnalyticsEvents('softskill_test_next',{})
        props?.navigation.replace('CareerAnalysisResult', {type: "Personality"});
    }

    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    }
  }, [isSuccess, isError]);
  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      
        <View bgc={"#FFF"} ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Your progress will be lost.", "Are you sure you want to exit?", [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    popNavigation();
                  },
                },
              ]);
            }}
            po="absolute"
            l={16}>
            <Text c={"#7F8A8E"}>Exit Test</Text>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Skills
          </Text>
          <View po="absolute" r={8} fd="row">
            <View mh={4} h={8} w={8} bgc={"#000"} br={4} />
            <View mh={4} h={8} w={8} bgc={"#000"} br={4} />
            <View mh={4} h={8} w={16} bgc={"#000"} br={4} />
          </View>
        </View>
        <Text ftsz={16} weight="500" pv={32} ph={32} ta="center">
        Assess yourself on these Soft Skills
        </Text>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View f={1} gap={12} ph={16} pv={30}>
          <Text c="#000" ftsz={14} lh={18} weight="400">
            My <Text weight="500">Communication</Text> skills are:
          </Text>
          <View mv={8}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SkillButton
              title="Oscar-worthy"
              color="#D8E3FC"
              isSelected={commSkill === "Oscar-worthy"}
              onPress={() => setCommSkill("Oscar-worthy")}
            />
            <SkillButton
              title="Good performance"
              color="#D7BDFB"
              isSelected={commSkill === "Good performance"}
              onPress={() => setCommSkill("Good performance")}
            />
            <SkillButton
              title="Silent Movie"
              color="#CAF3F2"
              isSelected={commSkill === "Silent Movie"}
              onPress={() => setCommSkill("Silent Movie")}
            />
            </ScrollView>
          </View>

          <Text c="#000" ftsz={14} lh={18} weight="400">
            My <Text weight="500">Time-management</Text> skills are:
          </Text>
          <View  mv={8} >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SkillButton
              title="Clock-master"
              color="#D8E3FC"
              isSelected={timeSkill === "Clock-master"}
              onPress={() => setTimeSkill("Clock-master")}
            />
            <SkillButton
              title="Efficient Scheduler"
              color="#D7BDFB"
              isSelected={timeSkill === "Efficient Scheduler"}
              onPress={() => setTimeSkill("Efficient Scheduler")}
            />
            <SkillButton
              title="Time-pressed"
              color="#CAF3F2"
              isSelected={timeSkill === "Time-pressed"}
              onPress={() => setTimeSkill("Time-pressed")}
            />
            </ScrollView>
          </View>

          <Text c="#000" ftsz={14} lh={18} weight="400">
            My <Text weight="500">Leadership</Text> style is:
          </Text>
          <View  mv={8}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SkillButton
              title="Visionary"
              color="#D8E3FC"
              isSelected={leadershipSkill === "Visionary"}
              onPress={() => setLeadershipSkill("Visionary")}
            />
            <SkillButton
              title="Inspirational"
              color="#D7BDFB"
              isSelected={leadershipSkill === "Inspirational"}
              onPress={() => setLeadershipSkill("Inspirational")}
            />
            <SkillButton
              title="Reluctant"
              color="#CAF3F2"
              isSelected={leadershipSkill === "Reluctant"}
              onPress={() => setLeadershipSkill("Reluctant")}
            />
            </ScrollView>
          </View>
          <Text c="#000" ftsz={14} lh={18} weight="400">
            My <Text weight="500">Adaptability</Text> style is:
          </Text>
          <View  mv={8} >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SkillButton
              title="Quick Adapter"
              color="#D8E3FC"
              isSelected={adaptabilitySkill === "Quick Adapter"}
              onPress={() => setAdaptabilitySkill("Quick Adapter")}
            />
            <SkillButton
              title="Change Resistant"
              color="#D7BDFB"
              isSelected={adaptabilitySkill === "Change Resistant"}
              onPress={() => setAdaptabilitySkill("Change Resistant")}
            />
            <SkillButton
              title="Stuck in routine"
              color="#CAF3F2"
              isSelected={adaptabilitySkill === "Stuck in routine"}
              onPress={() => setAdaptabilitySkill("Stuck in routine")}
            />
            </ScrollView>
          </View>

          <Text c="#000" ftsz={14} lh={18} weight="400">
            My <Text weight="500">Problem-solving</Text> skill is:
          </Text>
          <View  mv={8}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SkillButton
              title="Solution-oriented"
              color="#D8E3FC"
              isSelected={problemSkill === "Solution-oriented"}
              onPress={() => setProblemSkill("Solution-oriented")}
            />
            <SkillButton
              title="Troubleshooter"
              color="#D7BDFB"
              isSelected={problemSkill === "Troubleshooter"}
              onPress={() => setProblemSkill("Troubleshooter")}
            />
            <SkillButton
              title="Problem-identifier"
              color="#CAF3F2"
              isSelected={problemSkill === "Problem-identifier"}
              onPress={() => setProblemSkill("Problem-identifier")}
            />
            </ScrollView>
          </View>
        </View>
        </ScrollView>
        <TouchableOpacity
          onPress={onPressNext}
          disabled={disabled}
          bgc={disabled ? "#7F8A8E" : "#000"}
          mh={24}
          jc="center"
          ai="center"
          pv={16}
          br={12}>
          <Text ftsz={14} weight="600" c={"#FFF"}>
            Next
          </Text>
        </TouchableOpacity>
     
    </MainLayout>
  );
};

export default CareerAnalysisSoftSKills;
