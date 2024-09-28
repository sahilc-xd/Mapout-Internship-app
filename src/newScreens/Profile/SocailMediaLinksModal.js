import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icon from "react-native-vector-icons/AntDesign";
import { Text, TextInput } from "../../components";
import Icons from "../../constants/icons";
import SocialLinksData from "../../assets/jsons/socialLinks.json";
import { api } from "../../redux/api";
import { isValidURL } from "../../utils/isValidLink";
import { Platform } from "react-native";

const SocailMediaLinksModal = props => {
  const { showModal, closeModal, prevLinks , userId } = props;
  const [link, setLink] = useState("");
  const [selected, setSelected] = useState({});
  const [mapItems, setMapItems] = useState([]);
  const [saveProfile, { isLoading , isSuccess , isError , error}] = api.useSaveProfileMutation();
  const [errorMsg, seterrorMsg] = useState("");
  const [constants, setConstants] = useState(["Instagram", "X", "LinkedIn"]);

  const handleCloseModal = () => {
    closeModal();
  };

  const handleSelectSocial = item => {
    const typePresent = prevLinks.filter(pre => pre.type === item.type);
    if (typePresent.length > 0) {
      setLink(typePresent[0]?.link);
    } else {
      setLink("");
    }
    setSelected(item);
  };

  useEffect(() => {
    if (!prevLinks || prevLinks.length === 0) {
      const initial = SocialLinksData.find(link => link.type == "Instagram");
      setSelected(initial);
    } else {
      const allTypesPresent = SocialLinksData.every(link => prevLinks.some(prevLink => prevLink.type === link.type));
      if (allTypesPresent) {
        setSelected({ type: "AddOther" });
      } else {
        const missingLink = SocialLinksData.find(link => !prevLinks.some(prevLink => prevLink.type === link.type));
        setSelected(missingLink);
      }
    }
  }, [prevLinks]); 

  useEffect(() => {
    setMapItems([]);
    setLink('')
    let data = [];
    prevLinks.map(items => {
      data.push(items.type);
    });

    SocialLinksData.map(items => {
      if (constants.includes(items.type) && !data.includes(items.type)) {
        data.push(items.type);
      }
    });

    SocialLinksData.forEach(item => {
      if (data.includes(item.type)) {
        setMapItems(prev => [...prev, item]);
      }
    });
  }, [prevLinks]);

  const handleOnSaveLink = () => {
    if (!link || link?.length == 0) {
      return seterrorMsg("Enter a valid link");
    }

    if(!isValidURL(link)){
      return seterrorMsg("Enter a valid link");
    }

    let socialItem;

      const domain = link.split('/')[2];
      let flag = 0;
      SocialLinksData.map((social) => {
        if(social.type !== "Other"){
           if(social.keywords.includes(domain.toLowerCase())){
            flag = 1;
            socialItem = social
           }
        }
      })

      if((selected.type !== socialItem.type) && (selected.type !== "AddOther")){
        return seterrorMsg(`Enter a valid ${selected.type} link`);
      }

      if(flag == 0){
        const data = SocialLinksData.filter((item) => item.type == "Other")
        socialItem = data[0]
      }

     const newData = {
    type: selected.type === "AddOther" ? socialItem.type : selected.type,
    link,
  };

  const existingLinkIndex = prevLinks.findIndex((prevLink) => prevLink.type === newData.type);

  if (existingLinkIndex !== -1) {
    const updatedLinks = [...prevLinks];
    updatedLinks[existingLinkIndex] = newData;
    saveProfile({
      user_id: userId,
      links: updatedLinks,
    });
  } else {
    saveProfile({
      user_id: userId,
      links: [...prevLinks, newData],
    });
  }
  };


  useEffect(() => {
    isError && console.log("error" , error);
  },[isError])


  useEffect(() => {
    isSuccess && console.log("success");
  },[isSuccess])

  return (
    <Modal visible={showModal} transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : 'height'} f={1} bgc={"rgba(0,0,0,0.3)"}>
      <TouchableOpacity activeOpacity={1}
        onPress={handleCloseModal}
        f={1}
      />
      <View bgc={"#FFF"} ph={24} pv={32} btrr={32} btlr={32}>
        <TouchableOpacity onPress={handleCloseModal} asf="flex-end">
          <Icon name="close" size={18} color={"#202020"} />
        </TouchableOpacity>
        <Text ta="center" ftsz={16} weight="500">
          Add social Media Link
        </Text>
        {isLoading ? (
          <ActivityIndicator size={"large"} color={"#000"} />
        ) : (
          <>
            <View style={styles.boxWrapper}>
              {mapItems.map((item, index) => (
                <TouchableOpacity
                  key={index?.toString()}
                  onPress={() => handleSelectSocial(item)}
                  style={styles.box}
                  bgc={selected.type == item.type ? "#f6f6f6" : "#fff"}
                  bc={selected.type == item.type ? "#111" : "#8E8E8E"}
                  bw={selected.type == item.type ? 0.75 : 0}>
                  {prevLinks.some(pre => pre.type === item.type) && (
                    <Icons.GreenTick style={styles.greenTick} />
                  )}
                  <Image
                    source={{ uri: item?.icon }}
                    onError={error => console.log("Image error:", error)}
                    w={24}
                    h={24}
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => handleSelectSocial({type : "AddOther"})}
                style={styles.addOtherButton} 
                bc={selected.type == "AddOther" && "#FFF"}
                bw={selected.type == "AddOther" ? 0.4 : 0}
              >
                <Text style={styles.addOtherText}>+ Add Other</Text>
              </TouchableOpacity>
            </View>
            <View mb={20}>
              <Text style={styles.label}>
                {" "}
                {`Add ${(selected && selected.type !== "AddOther") ? selected.type : ''} Link`}{" "}
              </Text>
              {errorMsg.length > 0 && (
                <Text ftsz={12} c={"#d30000"}>
                  {" "}
                  {errorMsg}
                </Text>
              )}
              <TextInput
                value={link}
                onChangeText={data => {
                  seterrorMsg("");
                  setLink(data);
                }}
                bc={"#7F8A8E"}
                style={{ fontSize: 14, fontFamily: "Manrope-Regular" }}
                placeholder="Type here"
                placeholderTextColor={"#7F8A8E"}
                mt={4}
                bbw={1}
                c={"#000"}
              />
            </View>
            <View ai="center">
              <TouchableOpacity
                onPress={handleOnSaveLink}
                style={styles.saveButton} bgc={'#000'}>
                <Text ftsz={12} weight="500" style={styles.addOtherText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SocailMediaLinksModal;

const styles = StyleSheet.create({
  boxWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 32,
    flexWrap: "wrap",
    gap: 20,
  },
  box: {
    width: 32,
    height: 32,
    borderRadius: 4,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  greenTick: {
    position: "absolute",
    right: -5,
    top: -5,
  },
  addOtherButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: '90%',
    paddingVertical: 16,
  },
  addOtherText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#FFF'
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
  },
});
