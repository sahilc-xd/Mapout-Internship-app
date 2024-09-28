import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text, withBottomSheet } from '../../../components';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../../utils/navigationService';
import { useAppSelector } from '../../../redux';
import DocumentPicker, { types } from "react-native-document-picker";
import Icons from '../../../constants/icons';
import { api } from '../../../redux/api';
import logAnalyticsEvents from '../../../utils/logAnalyticsEvent';

const JobSectionPopUp = (props) => { 
  const user= useAppSelector(state=>state.user);
    const { dismiss } = useBottomSheetModal();
    const onClose = () => dismiss();
    const [step, setStep] = useState(1);
    const [chosenFile, setChosenFile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadCV, { isLoading: uploadCVLoading, isError: uploadCVError }] =
    api.useUploadCVMutation();
  const [parseCV, { isSuccess }] = api.useCvAutoFillMutation();


  const insets = useSafeAreaInsets();

  const handleUploadCVButton = ()=>{
    logAnalyticsEvents('job_boost_cv', {});
    setStep(2);
  }

  const handleCompleteProfile=()=>{
    logAnalyticsEvents('job_boost_profile', {});
    navigate('EditProfile');
    onClose();
  }

  const chooseFile=async()=>{
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.images, types.pdf, types.docx, types.doc],
        copyTo: "documentDirectory",
      });
      const { uri, type, name } = pickerResult;
      const cvData = {uri: uri, type: type, name: name};
      setChosenFile(cvData);
    } catch(error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong in UploadCV or ParseCV",
      });
    }
  }

  const onRemoveSelected = ()=>{
    setChosenFile(false);
  }

  const uploadResumeToServer=async()=>{
    setLoading(true);
    let data = new FormData();
    const { uri, type, name } = chosenFile;
    data.append("cv_doc", { uri, type, name });
    data.append("user_id", user?.user_id);
    const uploadResponse = await uploadCV(data);

    if (uploadResponse.data.item.cv_doc.file) {
      const file = uploadResponse.data.item.cv_doc.file;
      let cvData = new FormData();
      cvData.append("cv_url", file);
      cvData.append("user_id", user?.user_id);
      parseCV(cvData);
    } else {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error occured while trying to upload CV",
      });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      logAnalyticsEvents('resume_uploaded_jobs', {});
      setLoading(false);
      setStep(3);
    }
  }, [isSuccess]);

  return (
    <View f={1} ph={24} pb={insets.bottom}>
      <View bgc={'#d9d9d9'} w={66} h={4} br={40} mt={8} style={{ alignSelf: 'center' }} />
      <TouchableOpacity asf='flex-end' hitSlop={25} onPress={onClose} ai='flex-end'>
        <Icon name="close" size={18} color={"#202020"} />
      </TouchableOpacity>
       <View f={1} jc='center'>
        {
          step ===1 && <View>
            <Text ta='center' ftsz={16} weight='500' c={'#000'}>
              Personalise your job search
            </Text>
            <TouchableOpacity onPress={handleUploadCVButton} bgc={'#000'} pv={16} br={12} mt={16}>
              <Text ta='center' ftsz={12} weight='500' c={'#FFF'}>Upload your latest CV</Text>
            </TouchableOpacity>
            <Text ta='center' ftsz={12} weight='400' c={'#000'} mv={12}>OR</Text>
            <TouchableOpacity onPress={handleCompleteProfile} bgc={'#000'} pv={16} br={12}>
              <Text ta='center' ftsz={12} weight='500' c={'#FFF'}>Complete your MapOut profile</Text>
            </TouchableOpacity>
          </View>
        }
        {
          step === 2 && <View mv={16} f={1}>
            <Text ta='center' ftsz={16} weight='500' c={'#000'}>Upload CV</Text>
            <View f={1} jc='center'>
              {chosenFile !=false ? <><Text ta='center' ftsz={14} weight='500' c={'#000'}>File Chosen</Text> 
                <View mt={8} fd='row' ph={32} jc='center' ai='center'>
                  <View fd='row' jc='space-between' ai='center' bw={0.5} bc={'#D5D5D5'} br={8} f={1} pv={8} ph={8}>
                    <Text ftsz={12} weight='500' c={'#000'}>{chosenFile?.name}</Text>
                    <TouchableOpacity onPress={onRemoveSelected}>
                      <Icon name="close" size={18} color={"#202020"} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={chooseFile} mh={8}>
                  <Icons.PencilEdit width={20} height={20} fill={'#000'}/>
                  </TouchableOpacity>
                </View>
              </>: <>
              <Text ta='center' ftsz={14} weight='500' c={'#000'}>Upload your latest CV</Text>
              <Text ta='center' ftsz={12} weight='400' c={'#7F8A8E'}>Suitable formats: PDF. No more than 10mb</Text>
              </>}
            </View>
              <TouchableOpacity disabled={loading} onPress={chosenFile!=false ? uploadResumeToServer : chooseFile} pv={16} jc='center' ai='center' bgc={'#000'} br={12} >
                {loading? <ActivityIndicator color={'#FFF'} size={'small'}/> : <Text c={'#FFF'} ftsz={12} weight='500'>Choose File</Text>}
              </TouchableOpacity>
          </View>
        }
        {
          step === 3 && <View jc='center'>
            <Text ftsz={14} c={'#000'} ta='center' weight='700'>Matching your CV to <Text weight='700' c={'#5980FF'}>10,000+</Text> jobs</Text>
            <Text ftsz={14} c={'#000'} ta='center' weight='400' mt={16}>Check your best matches and employabilty score in an hour!</Text>
          </View>
        }
      </View>
    </View>
  );
};

export default withBottomSheet(JobSectionPopUp);
