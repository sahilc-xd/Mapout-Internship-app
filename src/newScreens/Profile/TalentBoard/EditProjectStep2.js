import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/MainLayout';
import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native-style-shorthand';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { useAppSelector } from '../../../redux';
import { api } from '../../../redux/api';
import { Dimensions, Platform } from 'react-native';
import { Text } from '../../../components';
import { ICONS } from '../../../constants';
import { PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import Toast from 'react-native-toast-message';

const itemWidth = (Dimensions.get('window').width - 40) / 3;

const EditProjectStep2 = ({ route }) => {
    const { goBack } = useNavigation();
    const [coverImage, setCoverImage] = useState('');
    const user = useAppSelector(state => state.user);
    const [isDrafted, setIsDrafted] = useState(false);
    const [addProjectToBoard, { isSuccess, isError, isLoading }] = api.useManageTalentBoardMutation();

    const handleCoverSelected = (image) => {
        setCoverImage(image);
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
                        launchImageLibrary({
                            mediaType: 'photo',
                            selectionLimit: 1
                        }).then(res => {
                            let assets = res?.assets;
                            setCoverImage(assets[0]);
                        }).catch(err => {
                            console.log("Error", err);
                        })
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
                    launchImageLibrary({
                        mediaType: 'photo',
                        selectionLimit: 1
                    }).then(res => {
                        let assets = res?.assets;
                        setCoverImage(assets[0]);
                    }).catch(err => {
                        console.log("Error", err);
                    })
                } else {
                    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                        if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
                            launchImageLibrary({
                                mediaType: 'photo',
                                selectionLimit: 1
                            }).then(res => {
                                let assets = res?.assets;
                                setCoverImage(assets[0]);
                            }).catch(err => {
                                console.log("Error", err);
                            })
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

    
    const selectedMedia = route?.params?.selectedMedia;
    const title = route?.params?.title;
    const desc = route?.params?.desc;
    const tags = route?.params?.tags;
    const link = route?.params?.link;
    const coverImg = route?.params?.coverImage;
    // const images = route?.params?.images;
    // const videos = route?.params?.videos;
    const projectID = route?.params?.projectID;
    const talentBoardID = route?.params?.talentBoardID;

    useEffect(() => {
        if(isSuccess) {
            Toast.show({
                type: 'success',
                text1: `Project ${isDrafted ? "drafted" : "added"} successfully`,
                text2: `Your project has been successfully ${isDrafted ? "drafted" : "added"} to your talent board.`,
            });
            navigate('Profile');
        }
    }, [isSuccess])

    useEffect(() => {
        if(isError) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong!',
                text2: 'We could not add your project, please try again.',
            });
        }
    }, [isError])

    const renderMediaItem = ({ item, index }) => {
        if(item?.serverFile === true) {
            return(
                <View style={{ height: itemWidth, width: itemWidth, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    {(item?.type === 'image') && <Image
                        source={{ uri: item?.url }}
                        style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                    />}
                    {item?.type === 'video' && <Video
                        source={{ uri: item?.url }}
                        style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                    />}
                    <TouchableOpacity disabled={coverImage?.fileName === item?.fileName} onPress={() => handleCoverSelected(item)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
                        <View style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 10 }}>
                            <View style={{ borderWidth: 1.2, borderColor: '#FFFFFF', height: 20, width: 20, borderRadius: 5, backgroundColor: coverImage?.fileName === item?.fileName ? '#4772F4' : 'transparent' }}></View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={{ height: itemWidth, width: itemWidth, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                {(item?.type === 'image/png' || item?.type === 'image/jpg') && <Image
                    source={{ uri: item?.uri }}
                    style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                />}
                {item?.type === 'video/mp4' && <Video
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
    }

    const handleAddProjectClicked =({isDraft}) => {
        setIsDrafted(isDraft)

        const bodyFormData = new FormData();
        const editDetails = {
            name: title,
            description: desc,
            isPublished: !isDraft,
            projectID: projectID ,
            talentBoardID: talentBoardID
        };
        bodyFormData.append("userId", user?._id);

        if(tags.length>0){
            let tagsJson = JSON.stringify(tags);
            bodyFormData.append("tags", tagsJson);
        }
        if(link.length>0){
            let linkJson = JSON.stringify(link);
            bodyFormData.append("updatedLinks", linkJson);
        }

        // bodyFormData.append("isPublished", !isDraft); 
        bodyFormData.append("isEdit", true);
        bodyFormData.append("editDetails", JSON.stringify(editDetails)); 
    
        let images = [];
        let videos = [];
        let documents = [];
    
        if (selectedMedia?.length > 0) {
            for (let i = 0; i < selectedMedia?.length; i++) {
                if (selectedMedia[i].type?.includes("image")) {
                    images.push(selectedMedia[i]);
                }
                if (selectedMedia[i].type?.includes("video")) {
                    videos.push(selectedMedia[i]);
                }
                if (selectedMedia[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedMedia[i].type === 'application/pdf' || selectedMedia[i].type === 'application/msword') {
                    documents.push(selectedMedia[i]);
                }
            }
        }
    
        images?.forEach((item) => {
            bodyFormData.append("images", {
                uri: item?.uri,
                type: item?.type,
                name: item?.fileName,
            });
        });
        videos?.forEach((item) => {
            bodyFormData.append("videos", {
                uri: item?.uri,
                type: item?.type,
                name: item?.fileName,
            });
        });
        documents?.forEach((item) => {
            bodyFormData.append("documents", {
                uri: item?.uri,
                type: item?.type,
                name: item?.fileName,
            });
        });
coverImage && bodyFormData.append("coverImg", {
    uri: coverImage?.uri,
    type: coverImage?.type,
    name: coverImage?.fileName,
});
        addProjectToBoard(bodyFormData);
    }

    return(
        <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <View fd='row' jc='space-between' ai='center' mt={20}>
                    <TouchableOpacity f={1} onPress={goBack} style={{ paddingLeft:20 }}>
                        <ICONS.BackArrow width={32} height={32}/>
                    </TouchableOpacity>
                    <View f={1}  style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Edit Project</Text>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <View style={{ width: 44, height: 4, marginRight: 5, borderRadius: 40, backgroundColor: '#000000' }}></View>
                            <View style={{ width: 44, height: 4, marginLeft: 5, borderRadius: 40, backgroundColor: '#7F8A8E' }}></View>
                        </View>
                    </View>
                    <TouchableOpacity  onPress={()=>handleAddProjectClicked({isDraft:true})} f={1} ai='flex-end' pr={20}>
                        <Text  style={{ fontSize: 14, fontWeight: '500', color: (title === '' || desc === '') ? '#AAAAAA' : '#000000' }}>Save Draft</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text>Step 2: Cover Photo</Text>
                    </View>
                    <ScrollView style={{ marginHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 30 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, fontWeight: '500' }}>{coverImg ? "Update " : "Add "}Cover photo for Project*</Text>
                            </View>
                            <TouchableOpacity onPress={handleChooseFileClicked} style={{ marginTop: 10, backgroundColor: 'rgba(216, 227, 252, 0.45)', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                                <Text style={{ color: '#000000', fontWeight: '500', fontSize: 12 }}>Choose File</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 12, fontWeight: '400' }}>Suitable formats: PNG/JPG. No more than 10MB.</Text>
                            </View>
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
                            <TouchableOpacity onPress={()=>handleAddProjectClicked({isDraft:false})} disabled={(!coverImg && coverImage === '' )|| isLoading} style={{ marginTop: 20, backgroundColor: (!coverImg && coverImage === '')  ? '#AAAAAA' : '#000000', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                            {isLoading ?
                                    <ActivityIndicator color={'#FFFFFF'} />
                                    :
                                    <Text style={{ color: '#FFFFFF' }}>Update Project</Text>
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </MainLayout>
    )
}

export default EditProjectStep2;