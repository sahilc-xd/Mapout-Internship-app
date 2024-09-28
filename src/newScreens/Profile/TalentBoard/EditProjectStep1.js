import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native-style-shorthand';
import MainLayout from '../../../components/MainLayout';
import { SelectInput, Text, TextInput } from '../../../components';
import Icons from '../../../constants/icons';
import { Dimensions, FlatList, Image, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import CustomText from '../../../components/CustomText/CustomText';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from "react-native-video";
import { navigate, popNavigation } from '../../../utils/navigationService';
import Icon from 'react-native-vector-icons/AntDesign';
import { api } from '../../../redux/api';
import { ICONS } from '../../../constants';
import { useAppSelector } from '../../../redux';

const tagsArray = [
    'sample1',
    'sample2',
    'sample3',
    'sample4',
    'sample5'
]

const itemWidth = (Dimensions.get('window').width - 40) / 3;

const FormItem = ({ isRequired = false, title, placeholder = "Type here", type = "text", value, options, onChange, removeTag, onSearch, searchKey }) => {
    const renderTag = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: '#D8E3FC', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, marginHorizontal: 4, borderRadius: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '500' }}>#{item}</Text>
                <TouchableOpacity onPress={() => removeTag(item)} style={{ marginLeft: 10 }}>
                    <Icon name="close" size={14}  color={'#000'}/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ marginTop: 20, borderBottomColor: '#000000' }}>
            <Text ftsz={13} weight='500'>{title}{isRequired && '*'}</Text>
            {type === 'text' &&
                <View style={{ marginVertical: 8 }}>
                    <TextInput value={value} placeholder={placeholder} onChangeText={onChange} style={{color: '#000'}} bbw={1} placeholderTextColor={'grey'} ftf='Manrope-Regular' ftsz={12} p={0} bc={'#7F8A8E'}/>
                </View>
            }
            {type === 'textarea' &&
                    <TextInput value={value} placeholder={placeholder} multiline onChangeText={onChange} style={{color: '#000', height: 140, borderColor: '#7F8A8E', borderWidth: 1, padding: 10, borderRadius: 8, marginVertical: 10}} ftsz={12} placeholderTextColor={'grey'} textAlignVertical='top' ftf='Manrope-Regular'/>
            }
            {type === 'dropdown' &&
                <SelectInput
                    searchKey={searchKey}
                    maxSelected={2}
                    selectedOptions={value}
                    onSearch={onSearch}
                    searchPlaceholder="Search Tag"
                    snapPoints={["80%"]}
                    value={value}
                    isMultipleValue={true}
                    onSelect={tag => { onChange(tag); }}
                    placeholder={placeholder}
                    options={[...options?.map(val => val.name)]}
                    label={title}
                    renderInput={({ onPressSelect }) => (
                        <TouchableOpacity onPress={onPressSelect} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <FlatList
                                data={value}
                                renderItem={renderTag}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                            <View>
                                <Icons.ChevronLeft width={20} height={20} fill={"#000"} style={{ transform: [{ rotate: "270deg" }] }} />
                            </View>
                        </TouchableOpacity>
                    )}
                />
            }
        </View>
    )
}

const EditProjectStep1 = ({ route }) => {
    const data = route?.params?.data;
    const user = useAppSelector(state => state.user);
    const talentBoardID = route?.params?.talentBoardID;
    const [tags, setTags] = useState(data?.tags || []);
    const [tagsArray, setTagsArray] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [title, setTitle] = useState(data?.name);
    const [desc, setDesc] = useState(data?.description);
    const [link, setLink] = useState(data?.link || "");
    const [uploadFormat, setUploadFormat] = useState('');
    const { data: tagsData, isLoading, isSuccess, isError, error } = api.useFetchAllTagsQuery();
    const [addProjectToBoard, { isSuccess:draftProjectSuccess, isLoading:draftProjectLoading }] = api.useManageTalentBoardMutation();
    const [searchTag, setSearchTag] = useState("");
    const debouncedSearchTag = useDebounce(searchTag, 300);

    useEffect(() => {
        if(isSuccess) {
            setTagsArray(tagsData?.data);
        }
    }, [isSuccess]);

    useEffect(() => {
        if(draftProjectSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Project saved as Draft',
                text2: 'Your Project has been successfully saved as Draft',
            });
            navigate('Profile');
        }
    }, [draftProjectSuccess])

    useEffect(() => {
        let newImages = []
        let newVideos = []
        for(let i=0;i<data?.imageUrls.length;i++) {
            newImages.push({...data?.imageUrls[i], serverFile: true, type: 'image'});
        }
        for(let i=0;i<data?.videoUrls.length;i++) {
            newVideos.push({...data?.videoUrls[i], serverFile: true, type: 'video'});
        }
        setSelectedMedia([...selectedMedia, ...newImages, ...newVideos]);
    }, []);

    const requestGalleryPermission = (type = "photo") => {
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
                            mediaType: 'mixed',
                            maxWidth: 300,
                            maxHeight: 400,
                            videoQuality: "high",
                        }).then(res => {
                            let filteredAssets = [];
                            let assets = res?.assets;
                            for (let i = 0; i < assets.length; i++) {
                                let alreadyExists = false;
                                for (let j = 0; j < selectedMedia.length; j++) {
                                    if (assets[i]?.fileName === selectedMedia[j].fileName) {
                                        alreadyExists = true;
                                    }
                                }
                                if (!alreadyExists) {
                                    filteredAssets.push(assets[i]);
                                }
                            }
                            if (selectedMedia.length > 0) {
                                selectedMedia.pop();
                            }

                            setSelectedMedia([...selectedMedia, ...filteredAssets, { lastItem: true }]);
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
                    launchImageLibrary({
                        mediaType: 'mixed',
                        selectionLimit: 10,
                        formatAsMp4: true,
                    }).then(res => {
                        let filteredAssets = [];
                        let assets = res?.assets;
                        for (let i = 0; i < assets.length; i++) {
                            let alreadyExists = false;
                            for (let j = 0; j < selectedMedia.length; j++) {
                                if (assets[i]?.fileName === selectedMedia[j].fileName) {
                                    alreadyExists = true;
                                }
                            }
                            if (!alreadyExists) {
                                filteredAssets.push(assets[i]);
                            }
                        }
                        if (selectedMedia.length > 0) {
                            selectedMedia.pop();
                        }

                        setSelectedMedia([...selectedMedia, ...filteredAssets, { lastItem: true }]);
                    }).catch(err => {
                        console.log("Error", err);
                    })
                } else {
                    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                        if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
                            launchImageLibrary({
                                mediaType: 'mixed',
                                selectionLimit: 10,
                                formatAsMp4: true,
                            }).then(res => {
                                let filteredAssets = [];
                                let assets = res?.assets;
                                for (let i = 0; i < assets.length; i++) {
                                    let alreadyExists = false;
                                    for (let j = 0; j < selectedMedia.length; j++) {
                                        if (assets[i]?.fileName === selectedMedia[j].fileName) {
                                            alreadyExists = true;
                                        }
                                    }
                                    if (!alreadyExists) {
                                        filteredAssets.push(assets[i]);
                                    }
                                }
                                if (selectedMedia.length > 0) {
                                    selectedMedia.pop();
                                }
        
                                setSelectedMedia([...selectedMedia, ...filteredAssets, { lastItem: true }]);
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

    const onSelectTag = (index) => {
        if (tags?.includes(index)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Oops! Looks like you have already added this tag.',
            });
        } else {
            if (tags?.length === 2) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'You can only add a maximum of 2 tags for a talent board.',
                });
            } else {
                setTags([...tags, index]);
            }
        }
    }

    const onChangeTitle = (val) => {
        setTitle(val);
    }

    const onChangeDesc = (val) => {
        setDesc(val)
    }

    const onChangeLink = (val) => {
        setLink(val)
    }

    const removeTag = (tagName) => {
        setTags(tags?.filter(tag => tag !== tagName))
    }

    const handleFormatSelected = (val) => {
        setUploadFormat(val);
    }

    const handleUploadClicked = () => {
        requestGalleryPermission();
    }

    const handleAddMoreClicked = () => {
        requestGalleryPermission();
    }

    const handleNextClicked = () => {
        if(title !== '') {
            if(desc !== '') {
                if(selectedMedia.length > 0) {
                    // let images = [];
                    // let videos = [];
                    // for(let i=0;i<selectedMedia.length;i++) {
                    //     if(selectedMedia[i].type === 'image/png' || selectedMedia[i].type === 'image/jpg') {
                    //         images.push(selectedMedia[i])
                    //     }
                    //     if(selectedMedia[i].type === 'video/mp4') {
                    //         videos.push(selectedMedia[i])
                    //     }
                    // }
                    navigate('EditProjectStep2', { selectedMedia, projectID: data?._id, talentBoardID, title, tags, desc, link:[link], coverImage: data?.coverImgUrls });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Please add atleast a single Image or Video.',
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please enter a description about project',
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a Project Title',
            });
        }
    }

    const handleSaveDraftProjectClicked =async () => {
        
        const bodyFormData = new FormData();
        const editDetails = {
            name: title,
            description: desc,
            isPublished: false,
            projectID: data?._id,
            talentBoardID: talentBoardID
        };
        bodyFormData.append("userId", user?._id);

        if(tags.length>0){
            let tagsJson = JSON.stringify(tags);
            bodyFormData.append("tags", tagsJson);
        }
        link && bodyFormData.append("link", link);
        bodyFormData.append("isPublished", false);
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
    
        addProjectToBoard(bodyFormData);
    }

    const handleDeleteClicked = (name) => {
        setSelectedMedia(selectedMedia.filter(item => item?.fileName !== name));
    }

    const renderMediaItem = ({ item, index }) => {
        if(item?.serverFile === true) {
            return(
                <View style={{ height: itemWidth, width: itemWidth, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        {item?.type === 'image' && <Image
                            source={{ uri: item?.url }}
                            style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                        />}
                        {item?.type === 'video' && <Video
                            source={{ uri: item?.url }}
                            pause={true}
                            style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                        />}
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
                            <TouchableOpacity onPress={() => handleDeleteClicked(item?.fileName)} style={{ alignItems: 'flex-end', marginRight: 15, marginTop: 10 }}>
                                <View style={{ borderWidth: 1.2, borderColor: '#FFFFFF', height: 20, width: 20, borderRadius: 10 }}></View>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
            )
        }
        return (
            <View style={{ height: itemWidth, width: itemWidth, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                {item?.lastItem ?
                    <TouchableOpacity onPress={handleAddMoreClicked} style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10, borderColor: '#7F8A8E', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 40 }}>+</Text>
                    </TouchableOpacity>
                    :
                    <View>
                        {(item?.type === 'image/png' || item?.type === 'image/jpg') && <Image
                            source={{ uri: item?.uri }}
                            style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                        />}
                        {item?.type === 'video/mp4' && <Video
                            source={{ uri: item?.uri }}
                            pause={true}
                            style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                        />}
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
                            <TouchableOpacity onPress={() => handleDeleteClicked(item?.fileName)} style={{ alignItems: 'flex-end', marginRight: 15, marginTop: 10 }}>
                                <View style={{ borderWidth: 1.2, borderColor: '#FFFFFF', height: 20, width: 20, borderRadius: 10 }}></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }

    return (
        <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <View fd='row' jc='space-between' ai='center' mt={20}>
                    <TouchableOpacity f={1} onPress={() => popNavigation()} style={{ paddingLeft:20 }}>
                        <ICONS.BackArrow width={32} height={32}/>
                    </TouchableOpacity>
                    <View f={1}  style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Update Project</Text>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <View style={{ width: 44, height: 4, marginRight: 5, borderRadius: 40, backgroundColor: '#000000' }}></View>
                            <View style={{ width: 44, height: 4, marginLeft: 5, borderRadius: 40, backgroundColor: '#7F8A8E' }}></View>
                        </View>
                    </View>
                    <TouchableOpacity disabled={draftProjectLoading || title === '' || desc === ''} onPress={handleSaveDraftProjectClicked} f={1} ai='flex-end' pr={20}>
                        <Text  style={{ fontSize: 14, fontWeight: '500', color: (title === '' || desc === '') ? '#AAAAAA' : '#000000' }}>Save Draft</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text>Step 1: Project Details</Text>
                    </View>
                    <ScrollView keyboardDismissMode="on-drag" style={{ marginHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                        <FormItem type='text' isRequired value={title} onChange={onChangeTitle} title={'Project'} />
                        <FormItem type='textarea' isRequired value={desc} onChange={onChangeDesc} title={'Description'} />
                        <FormItem type='dropdown' title={'Add Tags about your project'} value={tags} onChange={onSelectTag} removeTag={removeTag} options={tagsArray} onSearch={setSearchTag} searchKey={debouncedSearchTag}/>
                        <FormItem type='text' value={link} onChange={onChangeLink} title={'Add Link'} />
                        <View style={{ marginTop: 20 }}>
                            <Text>Chosen Media</Text>
                            <FlatList
                                data={selectedMedia}
                                renderItem={renderMediaItem}
                                numColumns={3}
                            />
                            <TouchableOpacity onPress={handleNextClicked} disabled={selectedMedia.length === 0} style={{ marginTop: 20, backgroundColor: selectedMedia.length === 0 ? '#AAAAAA' : '#000000', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                                <Text style={{ color: '#FFFFFF' }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </MainLayout>
    )
}

export default EditProjectStep1;