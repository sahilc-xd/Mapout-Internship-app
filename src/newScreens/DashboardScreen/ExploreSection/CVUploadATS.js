import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../../components";
import DocumentPicker, { types } from "react-native-document-picker";
import { ICONS } from "../../../constants";
import { navigate } from "../../../utils/navigationService";

const CVUploadATS = props => {
  const { showModal = false, closeModal = false } = props;
  const [step, setStep] = useState(0);
  const [cvPath, setCVPath] = useState(false);

  const handleCloseModal = () => {
    setCVPath(false);
    setStep(0);
    closeModal();
  };

  const chooseFile = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.images, types.pdf, types.docx, types.doc],
        copyTo: "documentDirectory",
      });
      const { uri, type, name } = pickerResult;
      const cvData = { uri: uri, type: type, name: name };
      setCVPath(cvData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong in UploadCV or ParseCV",
      });
    }
  };

  const checkScore=()=>{
    closeModal();
    navigate('CVATSScreen', {data: cvPath});
  }

  return (
    <>
      <Modal visible={showModal} transparent onRequestClose={closeModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseModal}
            f={1}
          />
          {step === 0 && (
            <View bgc={"#FFF"} ph={24} pv={32} btrr={32} btlr={32}>
              <Text ta="center" ftsz={16} weight="500">
                CV Analysis
              </Text>
              <Text mt={32} ftsz={16} weight="500">
                What is CV Analysis?
              </Text>
              <Text mt={16} ftsz={12} weight="400">
                CV Analysis helps you discover the strengths and weaknesses in
                your resume. Find out if your CV can pass through Applicant
                Tracking Systems (ATS) and catch the eye of employers.
              </Text>
              <Text mt={16} ftsz={12} weight="400">
                <Text ftsz={12} weight="700">
                  ATS (Applicant Tracking System):
                </Text>{" "}
                Software used by companies to filter and manage job applications
                based on resume content and formatting.
              </Text>
              <TouchableOpacity
                onPress={() => setStep(1)}
                ai="center"
                jc="center"
                bgc={"#000"}
                pv={12}
                br={12}
                mt={16}>
                <Text ftsz={14} weight="500" c={"#FFF"}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {step === 1 && (
            <View bgc={"#FFF"} ph={24} pv={32} btrr={32} btlr={32}>
              <Text ta="center" ftsz={16} weight="500">
                Upload your latest CV
              </Text>
              {!cvPath?.name?.length> 0 ? <View mv={32}>
                <Text ta="center" ftsz={14} weight="500">
                  Choose file
                </Text>
                <Text c={"#7F8A8E"} weight="400" ftsz={12} ta="center">
                  Suitable formats: PDF. No more than 10mb
                </Text>
              </View> : <View mv={32}>
                <Text ml={48} ftsz={14} weight="500">
                  Uploaded file:
                </Text>
                <View mt={4} mh={48} fd="row" ai="center" jc="space-between">
                    <View fd="row" ai="center">
                        <ICONS.FeedLink width={15} height={15}/>    
                        <Text ml={4} weight="400" ftsz={12}>
                        {cvPath?.name}
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <ICONS.PencilEdit />
                    </TouchableOpacity>
                </View>
              </View>}
              <TouchableOpacity
                onPress={!cvPath?.name?.length> 0 ? chooseFile : checkScore}
                ai="center"
                jc="center"
                bgc={"#000"}
                pv={12}
                br={12}
                mt={16}>
                <Text ftsz={14} weight="500" c={"#FFF"}>
                  {!cvPath?.name?.length> 0 ? "Choose file" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default CVUploadATS;
