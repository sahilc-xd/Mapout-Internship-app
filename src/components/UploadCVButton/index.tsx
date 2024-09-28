import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import {
  TouchableOpacity,
  ActivityIndicator,
} from "react-native-style-shorthand";
import DocumentPicker, { types } from "react-native-document-picker";

import { api } from "../../redux/api";
import Text from "../CustomText/CustomText";
import { useAppSelector } from "../../redux";
import Toast from "react-native-toast-message";

const UploadCVButton = (props) => {
  const {color='#000', textSize= false} = props
  const [uploadCV, { isLoading: uploadCVLoading,isError: uploadCVError }] = api.useUploadCVMutation();
  const [parseCV, {isLoading, isSuccess, isError }] = api.useParseCVMutation();
  const user = useAppSelector(state => state.user);
  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  }, [isError]);
  const onUploadFile = async () => {
    try {
      const userID = user?.user_id;
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.images, types.pdf, types.docx, types.doc],
        copyTo: "documentDirectory",
      });
      let data = new FormData();
      const { uri, type, name } = pickerResult;
      data.append("cv_doc", { uri, type, name });
      data.append("user_id", userID);
      const uploadResponse = await uploadCV(data);

      if (uploadResponse.data.item.cv_doc.file) {
        const file = uploadResponse.data.item.cv_doc.file;
      
        const parsedResponse = await parseCV({ userID, url: file });
       if(isSuccess) Toast.show({ type:'success',text1:'Parsed CV successfully!'})
      } else {
        Toast.show({ type:'error',text1:'Error occured when try to UploadCV to S3'})
      }
    } catch (error) {
      Toast.show({ type:'error',text1:'Something went wrong in UploadCV or ParseCV'})
    }
  };

  return (
    <TouchableOpacity
      bc={color}
      disabled={uploadCVLoading || isLoading}
      fd="row"
      bw={0.4}
      br={4}
      ai="center"
      jc="center"
      pv={textSize ? 4 : 8}
      ph={textSize ? 4 : 12}
      onPress={onUploadFile}
      hitSlop={20}>
      {(uploadCVLoading || isLoading) && <ActivityIndicator size="small" color={color} />}
      {(!uploadCVLoading || !isLoading) && (
        <>
          <Icon name="upload" size={textSize ? 12 : 16} color={color} />
          <Text ftsz={textSize ? textSize : 14} weight="400" pl={8} c={color}>
            Autofill with CV
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default UploadCVButton;
