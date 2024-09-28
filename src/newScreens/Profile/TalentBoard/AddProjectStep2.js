import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/MainLayout';
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from 'react-native-style-shorthand';
import { navigate, popNavigation } from '../../../utils/navigationService';
import { Dimensions, Image, PermissionsAndroid, Platform } from 'react-native';
import Video from "react-native-video";
import { api } from '../../../redux/api';
import { useAppSelector } from '../../../redux';
import Toast from 'react-native-toast-message';
import Icons from '../../../constants/icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, RESULTS, check,request } from 'react-native-permissions';
import { Text } from '../../../components';
import logAnalyticsEvents from '../../../utils/logAnalyticsEvent';
import ShowOnFeedModal from './showOnFeedModal';
import ImagePicker from "react-native-image-crop-picker";

const itemWidth = (Dimensions.get('window').width - 40) / 3;

const AddProjectStep2 = ({ route }) => {
    const [coverImage, setCoverImage] = useState('');
    const [isDrafted, setIsDrafted] = useState(false);
    const user = useAppSelector(state => state.user);
    const [ShowOnFeedModalOpen, setShowOnFeedModalOpen] = useState(false)
    const [IsModalOpened, setIsModalOpened] = useState(false)
    const [addProjectToBoard, { isSuccess, isError, isLoading , data }] = api.useManageTalentBoardMutation();
    const [talentBoardIds, settalentBoardIds] = useState({})

    useEffect(() => {
        if(isSuccess) {
            Toast.show({
                type: 'success',
                text1: `Project ${isDrafted ? "drafted" : "added"} successfully`,
                text2: `Your project has been successfully ${isDrafted ? "drafted" : "added"} to your talent board.`,
            });            

            if(!isDrafted) {
                setShowOnFeedModalOpen(true)
                setIsModalOpened(true)
                settalentBoardIds(data?.talendBoardProjectId)
            }else{
                navigate('Profile');
            }
        }
    }, [isSuccess])


     useEffect(() => {
         if(ShowOnFeedModalOpen == false && IsModalOpened == true) {
            navigate('Profile');
         }
     } , [ShowOnFeedModalOpen])

    useEffect(() => {
        if(isError) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong!',
                text2: 'We could not add your project, please try again.',
            });
        }
    }, [isError])



    const handleCoverSelected = async (image) => {
        console.log("image is ---");
        console.log(image);
        try {
        const croppedImage = await ImagePicker.openCropper({
            path: image.uri,
            width: 900,
            height: 400,
            cropperToolbarTitle: 'Crop Image',
           
            freeStyleCropEnabled: true,
            showCropGuidelines: true,
            enableRotationGesture: true,
            cropperActiveWidgetColor: '#3498DB',
            cropperStatusBarColor: '#3498DB',
            cropperToolbarWidgetColor: '#3498DB',
        });

            // Now set the cropped image to state
            const fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
            console.log("croopped iamge is ---- ", croppedImage);
            setCoverImage({ 
                            fileName:fileName,
                            fileSize: image.size,
                            height: croppedImage.height,
                            originalPath: croppedImage.path, // Adjust according to how you store the path
                            type: croppedImage.mime,
                            uri: croppedImage.path, // Adjust if you need a different URI format
                            width: croppedImage.width
                        });
    } catch (error) {
        console.log('Error cropping image:', error);
    }
}


    const selectedMedia = route?.params?.selectedMedia;
    const title = route?.params?.title;
    const desc = route?.params?.desc;
    const tags = route?.params?.tags;
    const link = route?.params?.link;
    const images = route?.params?.images;
    const videos = route?.params?.videos;
    console.log("videos are", videos);
    const documents = route?.params?.documents;
    const uploadFormat = route?.params?.uploadFormat;

    const renderMediaItem = ({ item, index }) => {
        if(!item?.lastItem) {
            return (
                <View style={{ height: itemWidth, width: itemWidth, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    {item?.type?.includes("image") && <Image
                        source={{ uri: item?.uri }}
                        style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                    />}
                    {item?.type?.includes("video") && <Video
                        source={{ uri: item?.uri }}
                        style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                    />}
                    <TouchableOpacity disabled={coverImage?.fileName === item?.fileName} onPress={() => handleCoverSelected(item)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
                        <View style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 10 }}>
                            <View style={{ borderWidth: 1.2, borderColor: '#FFFFFF', height: 20, width: 20, borderRadius: 5, backgroundColor: coverImage?.fileName === item?.fileName ? '#4772F4' : 'transparent' }}></View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return(
                <View></View>
            )
        }
    }

const handleChooseFileClicked = (type = "photo") => {
    if (Platform.OS == "android") {
        PermissionsAndroid.request(
            Platform.Version <= 32
                ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                : type == "photo"
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        )
            .then(res => {
                if (!!res && res == "granted") {
                    ImagePicker.openPicker({
                        width: 900,
                        height: 400,
                        cropping: true,
                        cropperToolbarTitle: "Crop your image",
                        compressImageQuality: 1
                    }).then(image => {
                        const fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
                        
                        setCoverImage({
                            fileName:fileName,
                            fileSize: image.size,
                            height: image.height,
                            originalPath: image.path, // Adjust according to how you store the path
                            type: image.mime,
                            uri: image.path, // Adjust if you need a different URI format
                            width: image.width
                        });

                    }).catch(err => {
                        console.log("Error", err);
                    });
                } else {
                    Alert.alert(
                        "Alert!",
                        "To upload/change pictures or video please provide Files and media permission in the app setting.",
                        [
                            {
                                text: "Cancel",
                                onPress: () => { },
                            },
                            {
                                text: "Open Settings",
                                onPress: () => {
                                    Linking.openSettings();
                                },
                            },
                        ],
                    );
                }
            })
            .catch(err => {
                console.log("err", err);
            });
    } else {
        check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(res => {
            if (res === RESULTS.GRANTED || res === RESULTS.LIMITED) {
                ImagePicker.openPicker({
                    width: 900,
                    height: 400,
                    cropping: true,
                    cropperToolbarTitle: "Crop your image",
                    compressImageQuality: 1
                }).then(image => {
                     const fileName = image.path.substring(image.path.lastIndexOf('/') + 1);

                    console.log(image);
                    setCoverImage({
                            fileName:fileName,
                            fileSize: image.size,
                            height: image.height,
                            originalPath: image.path, // Adjust according to how you store the path
                            type: image.mime,
                            uri: image.path, // Adjust if you need a different URI format
                            width: image.width
                        });
                }).catch(err => {
                    console.log("Error", err);
                });
            } else {
                request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
                        ImagePicker.openPicker({
                            width: 900,
                            height: 400,
                            cropping: true,
                            cropperToolbarTitle: "Crop your image",
                            compressImageQuality: 1
                        }).then(image => {
                            const fileName = image.path.substring(image.path.lastIndexOf('/') + 1);

                            setCoverImage({
                            fileName:fileName,
                            fileSize: image.size,
                            height: image.height,
                            originalPath: image.path, 
                            type: image.mime,
                            uri: image.path, 
                            width: image.width
                        });
                        }).catch(err => {
                            console.log("Error", err);
                        });
                    } else {
                        Alert.alert(
                            "Alert!",
                            "To upload/change pictures or video please provide Photos access in the app setting.",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => { },
                                },
                                {
                                    text: "Open Settings",
                                    onPress: () => {
                                        openSettings();
                                    },
                                },
                            ],
                        );
                    }
                });
            }
        });
    }
};

    const handleAddProjectClicked = ({isDraft}) => {
        setIsDrafted(isDraft)
        const bodyFormData = new FormData();
        bodyFormData.append("userId", user?._id);
        bodyFormData.append("name", title);
        if(tags.length>0){
            let tagsJson = JSON.stringify(tags);
            bodyFormData.append("tags", tagsJson);
        }        
        bodyFormData.append("description", desc);
        bodyFormData.append("link", link);
        bodyFormData.append("isPublished", !isDraft);

        images?.forEach((item)=>{
            bodyFormData.append("images", {
                uri: item?.uri,
                type: item?.type,
                name: item?.fileName,
            });
        })
        videos?.forEach((item)=>{
            bodyFormData.append("videos", {
                uri: item?.uri,
                type: item?.type,
                name: item?.fileName,
            });
        })
        videos?.forEach((item)=>{
            bodyFormData.append("documents", {
                uri: item?.uri,
                type: item?.type,
                name: item?.fileName,
            });
        })
        coverImage && bodyFormData.append("coverImg", {
            uri: coverImage?.uri,
            type: coverImage?.type,
            name: coverImage?.fileName,
        });
        addProjectToBoard(bodyFormData);
        
    }

    const handleShareOnFeed = () => {
        setIsModalOpened(false)
        setShowOnFeedModalOpen(false)
        const talentBoardDatas = {
            coverImage,
            title,
            tags
        }
        navigate('AddFeedPost', {isTalentBoard : true , talentBoardDatas , talentBoardIds})
    }

    return(
        <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">

        <ShowOnFeedModal
          showModal={ShowOnFeedModalOpen}
          closeModal={() => setShowOnFeedModalOpen(false)}
          handleShareOnFeed={handleShareOnFeed}
        />
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

                 <View fd='row' jc='space-between' ai='center'>
                    <TouchableOpacity f={1} onPress={() => popNavigation()} style={{ paddingLeft:20 }}>
                        <Icons.BackArrow width={32} height={32}/>
                    </TouchableOpacity>
                    <View f={1}  style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Add Project</Text>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <View style={{ width: 44, height: 4, marginRight: 5, borderRadius: 40, backgroundColor: '#000000' }}></View>
                            <View style={{ width: 44, height: 4, marginLeft: 5, borderRadius: 40, backgroundColor: '#7F8A8E' }}></View>
                        </View>
                    </View>
                    <TouchableOpacity disabled={coverImage === '' || isLoading}  onPress={()=>handleAddProjectClicked({isDraft:true})} f={1} ai='flex-end' pr={20}>
                        <Text  style={{ fontSize: 14, fontWeight: '500' }}>Save Draft</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text>Step 2: Cover Photo</Text>
                    </View>
                    <ScrollView style={{ marginHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 30 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, fontWeight: '500' }}>Add Cover photo for Project*</Text>
                            </View>
                            <TouchableOpacity onPress={handleChooseFileClicked} style={{ marginTop: 10, backgroundColor: 'rgba(216, 227, 252, 0.45)', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                                <Text style={{ color: '#000000', fontWeight: '500', fontSize: 12 }}>Choose File</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 12, fontWeight: '400' }}>Suitable formats: PNG/JPG. No more than 10MB.</Text>
                            </View>
                            {uploadFormat === 'img' && 
                                <>
                                    <View style={{ alignItems: 'center', marginVertical: 30 }}>
                                        <Text>Or</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 13, fontWeight: '500' }}>Use one of the following images</Text>
                                        <FlatList
                                            data={selectedMedia}
                                            renderItem={renderMediaItem}
                                            numColumns={3}
                                        />
                                    </View>
                                </>
                            }
                            <TouchableOpacity disabled={coverImage === '' || isLoading} onPress={()=>handleAddProjectClicked({isDraft:false})} style={{ marginTop: 20, backgroundColor: coverImage === '' ? '#AAAAAA' : '#000000', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                                {isLoading ?
                                    <ActivityIndicator color={'#FFFFFF'} />
                                    :
                                    <Text style={{ color: '#FFFFFF' }}>Add Project</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </MainLayout>
    )
}

export default AddProjectStep2;