import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { SelectInput, Text } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";
import { useAppSelector } from "../../redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GradientBackground from "../../utils/GradientBackground";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const SkillDetails = props => {
  const handleButtonPress = props?.handleButtonPress;
  const [inputError, setInputError] = useState(false);
  const user = useAppSelector(state => state?.user);
  const [
    getSkillsSuggestions,
    {
      isSuccess: isSkillSuggestionsSuccess,
      isError: isSkillSuggestionsError,
      isFetching,
      data: skillSuggestions,
      isLoading: isSkillSuggestionsLoading,
    },
  ] = api.useLazySkillSuggestionsQuery();

  const [skillsSuggestions, setSkillsSuggestions] = useState({
    technical_skills: [],
    soft_skills: [],
  });

  const techSkills =
    user?.skillAspirations?.[0]?.technical_skills?.map(item => {
      return {
        skill: item?.name,
        experience:
          item?.level === 1
            ? "Beginner"
            : item?.level === 2
            ? "Intermediate"
            : "Experienced",
      };
    }) || false;
  const [technicalSkills, setTechnicalSkills] = useState(
    techSkills?.length > 0
      ? techSkills
      : [
          { skill: "", experience: "" },
          { skill: "", experience: "" },
          { skill: "", experience: "" },
        ],
  );
  const [softSkills, setSoftSkills] = useState(
    user?.skillAspirations?.[0]?.soft_skills?.length > 0
      ? user?.skillAspirations?.[0]?.soft_skills
      : [""],
  );

  useEffect(() => {
    if (user?.workDetails.length > 0) {
      const jobTitle = user?.workDetails?.map(item => item?.role).join(",");
      const degree = user?.educationDetails
        ?.map(item => item?.degree)
        .join(",");
      const techSkillsData = technicalSkills.map(item => item?.skill).join(",");
      const softSkillsData = softSkills.map(item => item).join(",");
      const skills = `${techSkillsData},${softSkillsData}`;

      const encodedJobTitle = encodeURIComponent(jobTitle);
      const encodedDegree = encodeURIComponent(degree);
      const encodedSkills = encodeURIComponent(skills);

      getSkillsSuggestions({ jobTitle: encodedJobTitle, degree: encodedDegree, skills: encodedSkills });
    }
  }, [user, technicalSkills, softSkills]);

  useEffect(() => {
    if (isSkillSuggestionsSuccess) {
      setSkillsSuggestions({
        technical_skills: skillSuggestions?.data?.technical_skills,
        soft_skills: skillSuggestions?.data?.soft_skills,
      });
    }
  }, [isSkillSuggestionsSuccess, isFetching]);

  const [searchTechSkills, setSearchTechSkills] = useState("");
  const debouncedValue = useDebounce(searchTechSkills, 300);
  const [techSkillsDataList, setTechSkillsDataList] = useState([]);
  const {
    data: techSkillsList,
    page: techSkillsListPage,
    onReachedEnd: onReachedTechSkillsEnd,
    loadingMoreData: loadMoreTechSkillsData,
  } = usePagination(debouncedValue, techSkillsDataList);
  const {
    data: techSkillsData,
    isSuccess: isTechSkillSuccess,
    isLoading: isLoadingTechSkills,
  } = api.useGetTechnicalSkillsQuery({
    search: debouncedValue,
    page: techSkillsListPage,
  });
  const [searchSoftSkills, setSearhSoftSkills] = useState("");
  const debouncedSoftSkill = useDebounce(searchSoftSkills,300);
  const [softSkillsDataList, setSoftSkillsDataList] = useState([]);
  const {
    data: softSkillsList,
    page: softSkillsListPage,
    onReachedEnd: onReachedSoftSkillsEnd,
    loadingMoreData: loadMoreSoftSkillsData,
  } = usePagination(debouncedSoftSkill, softSkillsDataList);
  const {
    data: softSkillsData,
    isSuccess: isSoftSkillSuccess,
    isLoading: isLoadingSoftSkills,
  } = api.useGetEducationWorkDetailsQuery({
    search: debouncedSoftSkill,
    page: softSkillsListPage,
    type: 'softSkills'
  });
  const [saveProfile, { data, isSuccess, isLoading, isError, error }] =
    api.useSaveProfileSkillMutation();
  const [refreshScore, {}] = api.useRefreshScoreMutation();

  useEffect(() => {
    if (techSkillsData?.data?.length > 0) {
      setTechSkillsDataList([...techSkillsData?.data]);
    } else {
      setTechSkillsDataList([]);
    }
  }, [techSkillsData]);

  useEffect(() => {
    if (softSkillsData?.data?.length > 0) {
      setSoftSkillsDataList([...softSkillsData?.data]);
    } else {
      setSoftSkillsDataList([]);
    }
  }, [softSkillsData]);

  useEffect(() => {
    if (isSuccess) {
      refreshScore({ user_id: user?.user_id });
      logAnalyticsEvents('completed_skills_profile', {});
      handleButtonPress();
    }
  }, [isSuccess]);

  const addTechnicalSkill = () => {
    setTechnicalSkills(prv => {
      let data = [...prv];
      data.push({ skill: "", experience: "" });
      return data;
    });
  };

  const addSoftSkill = () => {
    setSoftSkills(prv => {
      let data = [...prv];
      data.push("");
      return data;
    });
  };

  const deleteTechnicalSkill = index => {
    setTechnicalSkills(prv => {
      let data = [...prv];
      data.splice(index, 1);
      return [...data];
    });
  };

  const deleteSoftSkill = index => {
    setSoftSkills(prv => {
      let data = [...prv];
      data.splice(index, 1);
      return [...data];
    });
  };

  const selectTechSkill = (val, index) => {
    const techSkills = technicalSkills?.map(item => {
      return item?.skill;
    });
    if (techSkills?.includes(val)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "This skill is already selected.",
      });
      return;
    }
    setTechnicalSkills(prv => {
      let data = [...prv];
      let updateData = { ...data?.[index], skill: val };
      data.splice(index, 1);
      data.splice(index, 0, updateData);
      return data;
    });
  };

  const selectTechSkillExperience = (val, index) => {
    setTechnicalSkills(prv => {
      let data = [...prv];
      let updateData = { ...data?.[index], experience: val };
      data.splice(index, 1);
      data.splice(index, 0, updateData);
      return data;
    });
  };

  const selectSoftSkill = (val, index) => {
    if (softSkills?.includes(val)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "This skill is already selected.",
      });
      return;
    }
    setSoftSkills(prv => {
      let data = [...prv];
      data.splice(index, 1);
      data.splice(index, 0, val);
      return data;
    });
  };

  const onPressSave = () => {
    const checkTechSkills = technicalSkills?.map((item, index) => {
      if (
        item?.skill?.trim()?.length <= 0 ||
        item?.experience?.trim()?.length <= 0
      ) {
        return false;
      }
      return true;
    });
    if (checkTechSkills?.includes(false)) {
      const index = checkTechSkills?.indexOf(false);
      !inputError &&
        setInputError({
          id: index,
          key:
            technicalSkills[index]?.skill?.trim()?.length <= 0
              ? "tech-skill"
              : "tech-experience",
          errorMsg: "Missing",
        });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select all necessary fields.",
      });
      return;
    }
    const checkSoftSkills = softSkills?.map((item, index) => {
      if (item?.trim()?.length <= 0) {
        !inputError &&
          setInputError({
            id: index,
            key: "soft-skill",
            errorMsg: "Missing",
          });
        return false;
      }
      return true;
    });
    if (checkSoftSkills?.includes(false)) {
      const index = checkSoftSkills?.indexOf(false);
      !inputError &&
        setInputError({
          id: index,
          key: "soft-skill",
          errorMsg: "Missing",
        });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select all necessary fields.",
      });
      return;
    }
    const techData = technicalSkills?.map(item => {
      const data = {
        name: item?.skill,
        level:
          item?.experience === "Beginner"
            ? 1
            : item?.experience === "Intermediate"
            ? 2
            : 3,
      };
      return data;
    });
    const data = {
      soft_skills: softSkills,
      technical_skills: techData,
      user_id: user?.user_id,
    };
    saveProfile(data);
  };

  const handleTechnicalSkillAddFromSuggestion = item => {
    setTechnicalSkills(prv => {
      const updatedSkills = [...prv];

      let flag = 0;
      for (let index = 0; index < updatedSkills.length; index++) {
        if (updatedSkills[index]?.skill?.length == 0) {
          updatedSkills[index] = { skill: item, experience: "" };
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        updatedSkills.push({ skill: item, experience: "" });
      }
      return updatedSkills;
    });
  };

  const handleSofSkillAddFromSuggestion = item => {
    setSoftSkills(prv => {
      const updatedSkills = [...prv];

      let flag = 0;
      for (let index = 0; index < updatedSkills.length; index++) {
        if (updatedSkills[index].length == 0) {
          updatedSkills[index] = item;
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        updatedSkills.push(item);
      }
      return updatedSkills;
    });
  };

  return isLoadingTechSkills ? (
    <View f={1} ai="center" jc="center">
      <ActivityIndicator size={"large"} color={"#000"} />
    </View>
  ) : (
    <>
      <View f={1}>
        <KeyboardAwareScrollView
          style={{ flex: 1, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}>
          <View m={24}>
            <Text mb={32} ftsz={16} weight="700" bbw={1} asf="flex-start">
              Technical Skills
            </Text>
            {technicalSkills?.map((item, index) => {
              return (
                <>
                  <View
                    fd="row"
                    ai="baseline"
                    gap={16}
                    mb={technicalSkills?.length > 3 ? 0 : 16}>
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Skill*
                      </Text>
                      <SelectInput
                        onSearch={setSearchTechSkills}
                        searchPlaceholder="Search technical skills"
                        onReachEnd={onReachedTechSkillsEnd}
                        onReachEndThreshold={0.5}
                        loadingMoreData={loadMoreTechSkillsData}
                        onSelect={val => {
                          selectTechSkill(val, index);
                          inputError &&
                            inputError?.key === "tech-skill" &&
                            inputError?.id === index &&
                            setInputError(false);
                        }}
                        selectedOptions={item?.skill}
                        options={[...techSkillsList?.map(val => val.name)]}
                        label="Technical Skills*"
                        renderInput={({ onPressSelect }) => (
                          <TouchableOpacity
                            onPress={onPressSelect}
                            jc="center"
                            ai="center"
                            mt={12}
                            bbw={1}
                            bc={"#7F8A8E"}
                            fd="row"
                            gap={16}>
                            <Text
                              numberOfLines={1}
                              f={1}
                              weight="400"
                              ftsz={14}
                              c={item?.skill?.length ? "#000" : "#7F8A8E"}
                              pb={4}>
                              {item?.skill?.length
                                ? item?.skill
                                : "Choose here"}
                            </Text>
                            <Icons.ChevronLeft
                              width={20}
                              height={20}
                              fill={"#000"}
                              style={{
                                transform: [{ rotate: "270deg" }],
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      />
                      {inputError &&
                        inputError?.key === "tech-skill" &&
                        inputError?.id === index && (
                          <Text ftsz={12} weight="500" c={"red"}>
                            {inputError?.errorMsg}
                          </Text>
                        )}
                    </View>
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Level of experience*
                      </Text>
                      <SelectInput
                        snapPoints={["50%"]}
                        onSelect={val => {
                          selectTechSkillExperience(val, index);
                          inputError &&
                            inputError?.key === "tech-experience" &&
                            inputError?.id === index &&
                            setInputError(false);
                        }}
                        options={["Beginner", "Intermediate", "Experienced"]}
                        selectedOptions={item?.experience}
                        label="Level of experience*"
                        renderInput={({ onPressSelect }) => (
                          <TouchableOpacity
                            onPress={onPressSelect}
                            jc="center"
                            ai="center"
                            mt={12}
                            bbw={1}
                            bc={"#7F8A8E"}
                            fd="row"
                            gap={16}>
                            <Text
                              f={1}
                              weight="400"
                              ftsz={14}
                              c={item?.experience?.length ? "#000" : "#7F8A8E"}
                              pb={4}>
                              {item?.experience?.length
                                ? item?.experience
                                : "Choose here"}
                            </Text>
                            <Icons.ChevronLeft
                              width={20}
                              height={20}
                              fill={"#000"}
                              style={{
                                transform: [{ rotate: "270deg" }],
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      />
                      {inputError &&
                        inputError?.key === "tech-experience" &&
                        inputError?.id === index && (
                          <Text ftsz={12} weight="500" c={"red"}>
                            {inputError?.errorMsg}
                          </Text>
                        )}
                    </View>
                  </View>
                  {technicalSkills?.length > 3 && (
                    <TouchableOpacity
                      onPress={() => {
                        deleteTechnicalSkill(index);
                      }}
                      mt={4}
                      mb={8}
                      asf="flex-end">
                      <Text c={"#7F8A8E"} ftsz={10} weight="400">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            })}
            <TouchableOpacity
              onPress={addTechnicalSkill}
              bgc={"rgba(216, 227, 252, 0.45)"}
              asf="baseline"
              pv={8}
              ph={8}
              br={8}>
              <Text ftsz={12} weight="500">
                + Add Other
              </Text>
            </TouchableOpacity>

            {
              <View mt={14}>
                <GradientBackground>
                  <View>
                    <Text style={styles.heading}>✨ MapOut suggestions ✨</Text>
                    <>
                      {isSkillSuggestionsLoading ? (
                        <Text style={styles.paragraph}>
                          Generating Suggestions...
                        </Text>
                      ) : (
                        <View fw="wrap" fd="row" gap={8} mt={8}>
                          {skillsSuggestions?.technical_skills &&
                            skillsSuggestions?.technical_skills.length > 0 &&
                            skillsSuggestions.technical_skills.map(item => {
                              if (
                                technicalSkills.every(
                                  skill => skill.skill !== item,
                                )
                              ) {
                                return (
                                  <TouchableOpacity
                                    key={item}
                                    fd="row"
                                    ai="center"
                                    bgc={"#fff"}
                                    pv={2}
                                    ph={14}
                                    br={28}
                                    onPress={() =>
                                      handleTechnicalSkillAddFromSuggestion(
                                        item,
                                      )
                                    }>
                                    <Text style={styles.paragraph}>{item}</Text>
                                    <Text ftsz={28} ftw="600" ml={4}>
                                      +
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            })}
                        </View>
                      )}
                    </>
                  </View>
                </GradientBackground>
              </View>
            }
          </View>
          <View m={24}>
            <Text mb={16} ftsz={16} bbw={1} weight="600" asf="flex-start">
              Soft Skills
            </Text>
            {softSkills?.map((item, index) => {
              return (
                <>
                  <View mt={16}>
                    <View>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Soft Skill*
                      </Text>
                      <SelectInput
                        onSearch={setSearhSoftSkills}
                        searchPlaceholder="Search soft skills"
                        onReachEnd={onReachedSoftSkillsEnd}
                        onReachEndThreshold={0.5}
                        loadingMoreData={loadMoreSoftSkillsData}
                        onSelect={val => {
                          selectSoftSkill(val, index);
                          inputError &&
                            inputError?.key === "soft-skill" &&
                            inputError?.id === index &&
                            setInputError(false);
                        }}
                        options={[...softSkillsList?.map(val => val.name)]}
                        label="Soft Skill*"
                        selectedOptions={softSkills}
                        renderInput={({ onPressSelect }) => (
                          <TouchableOpacity
                            onPress={onPressSelect}
                            jc="center"
                            ai="center"
                            mt={12}
                            bbw={1}
                            bc={"#7F8A8E"}
                            fd="row"
                            gap={16}>
                            <Text
                              f={1}
                              weight="400"
                              ftsz={14}
                              c={item?.length ? "#000" : "#7F8A8E"}
                              pb={4}>
                              {item?.length ? item : "Choose here"}
                            </Text>
                            <Icons.ChevronLeft
                              width={20}
                              height={20}
                              fill={"#000"}
                              style={{
                                transform: [{ rotate: "270deg" }],
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                  {inputError &&
                    inputError?.key === "soft-skill" &&
                    inputError?.id === index && (
                      <Text ftsz={12} weight="500" c={"red"}>
                        {inputError?.errorMsg}
                      </Text>
                    )}
                  {softSkills?.length > 3 && (
                    <TouchableOpacity
                      onPress={() => {
                        deleteSoftSkill(index);
                      }}
                      asf="flex-end">
                      <Text c={"#7F8A8E"} ftsz={10} weight="400">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                addSoftSkill();
              }}
              bgc={"rgba(216, 227, 252, 0.45)"}
              asf="baseline"
              pv={8}
              ph={8}
              mt={16}
              br={8}>
              <Text ftsz={12} weight="500">
                + Add Other
              </Text>
            </TouchableOpacity>

            {
              <View mt={14}>
                <GradientBackground>
                  <View>
                    <Text style={styles.heading}>✨ MapOut suggestions ✨</Text>
                    <>
                      {isSkillSuggestionsLoading ? (
                        <Text style={styles.paragraph}>
                          Generating Suggestions...
                        </Text>
                      ) : (
                        <View fw="wrap" fd="row" gap={8} mt={8}>
                          {skillsSuggestions.soft_skills &&
                            skillsSuggestions?.soft_skills?.length > 0 &&
                            skillsSuggestions?.soft_skills?.map(item => {
                              if (softSkills.every(skill => skill !== item)) {
                                return (
                                  <TouchableOpacity
                                    key={item}
                                    fd="row"
                                    ai="center"
                                    bgc={"#fff"}
                                    pv={2}
                                    ph={14}
                                    br={28}
                                    onPress={() =>
                                      handleSofSkillAddFromSuggestion(item)
                                    }>
                                    <Text style={styles.paragraph}>{item}</Text>
                                    <Text ftsz={28} ftw="600" ml={4}>
                                      +
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            })}
                        </View>
                      )}
                    </>
                  </View>
                </GradientBackground>
              </View>
            }
          </View>
          <View h={100} />
        </KeyboardAwareScrollView>
      </View>
      <TouchableOpacity
        onPress={onPressSave}
        jc="center"
        ai="center"
        bgc={"#000"}
        pv={16}
        mv={4}
        mh={24}
        br={12}>
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"#FFF"} />
        ) : (
          <Text ftsz={14} weight="500" c={"#FFF"}>
            Save & Next
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-Bold",
    marginBottom: 6,
  },
  paragraph: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
  },
});

export default SkillDetails;
