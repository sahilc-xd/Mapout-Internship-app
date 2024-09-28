import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, FlatList } from 'react-native-style-shorthand';
import MainLayout from '../../../components/MainLayout';
import { SelectInput, Text, TextInput } from '../../../components';
import Icons from '../../../constants/icons';
import { Alert, Dimensions, Image, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from "react-native-video";
import { navigate, popNavigation } from '../../../utils/navigationService';
import DocumentPicker, { types } from "react-native-document-picker";
import { api } from '../../../redux/api';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAppSelector } from '../../../redux';

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
                    <TextInput placeholder={placeholder} onChangeText={onChange} style={{color: '#000'}} bbw={1} placeholderTextColor={'grey'} ftf='Manrope-Regular' ftsz={12} p={0} bc={'#7F8A8E'}/>
                </View>
            }
            {type === 'textarea' &&
                    <TextInput placeholder={placeholder} multiline onChangeText={onChange} style={{color: '#000', height: 140, borderColor: '#7F8A8E', borderWidth: 1, padding: 10, borderRadius: 8, marginVertical: 10}} ftsz={12} placeholderTextColor={'grey'} textAlignVertical='top' ftf='Manrope-Regular'/>
            }
            {type === 'dropdown' &&
                <SelectInput
                    searchKey={searchKey}
                    onSearch={onSearch}
                    searchPlaceholder="Search Tag"
                    snapPoints={["80%"]}
                    value={value}
                    selectedOptions={value}
                    maxSelected={2}
                    isMultipleValue={true}
                    onSelect={index => { onChange(index); }}
                    placeholder={placeholder}
                    options={[...options?.map(val => val.name)]}
                    label={title}
                    renderInput={({ onPressSelect }) => (
                        <TouchableOpacity bbw={0.4} borderColor= {'#7F8A8E'} pb={8} onPress={onPressSelect} style={{ flexDirection: 'row', marginTop: 10 }}>
                            <FlatList
                                f={1}
                                data={value}
                                renderItem={renderTag}
                                horizontal
                                scrollEnabled
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

const AddProjectStep1 = () => {
    const [tags, setTags] = useState([]);
    const [tagsArray, setTagsArray] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');
    const [uploadFormat, setUploadFormat] = useState('');
    const { data, isSuccess } = api.useFetchAllTagsQuery();
    const [addProjectToBoard, { isSuccess:draftProjectSuccess, isError, isLoading }] = api.useManageTalentBoardMutation();
    const [searchTag, setSearchTag] = useState("");
    const debouncedSearchTag = useDebounce(searchTag, 300);
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        if(isSuccess) {
            setTagsArray(data?.data);
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

    const requestGalleryPermission = async (type = "photo") => {
        const handleAssets = (assets) => {
            let filteredAssets = [];
            for (let i = 0; i < assets?.length; i++) {
                let alreadyExists = false;
                for (let j = 0; j < selectedMedia?.length; j++) {
                    if (assets[i]?.fileName === selectedMedia[j]?.fileName) {
                        alreadyExists = true;
                    }
                }
                if (!alreadyExists) {
                    filteredAssets.push(assets[i]);
                }
            }
            if (selectedMedia?.length > 0) {
                selectedMedia.pop();
            }
            setSelectedMedia([...selectedMedia, ...filteredAssets, { lastItem: true }]);
        };
    
        const launchLibrary = async () => {
            const options = {
                mediaType: type,
                maxWidth: 1080,
                maxHeight: 1920,
                videoQuality: 'high',
                selectionLimit: type === 'photo' ? 10 : 1,
            };
    
            try {
                const res = await launchImageLibrary(options);
                if (res?.assets) {
                    handleAssets(res.assets);
                }
            } catch (err) {
                console.log("Error", err);
            }
        };
    
        if (Platform.OS === 'android') {
            const permission = Platform.Version <= 32
                ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                : type === 'photo'
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO;
    
            try {
                const res = await PermissionsAndroid.request(permission);
                if (res === PermissionsAndroid.RESULTS.GRANTED) {
                    await launchLibrary();
                } else {
                    Alert.alert(
                        "Alert!",
                        "To upload/change pictures or video please provide Files and media permission in the app setting.",
                        [
                            { text: "Cancel" },
                            { text: "Open Settings", onPress: () => Linking.openSettings() },
                        ],
                    );
                }
            } catch (err) {
                console.log("Error", err);
            }
        } else {
            try {
                const res = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if (res === RESULTS.GRANTED || res === RESULTS.LIMITED) {
                    await launchLibrary();
                } else {
                    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
                        await launchLibrary();
                    } else {
                        Alert.alert(
                            "Alert!",
                            "To upload/change pictures or video please provide Photos access in the app setting.",
                            [
                                { text: "Cancel" },
                                { text: "Open Settings", onPress: () => Linking.openSettings() },
                            ],
                        );
                    }
                }
            } catch (err) {
                console.log("Error", err);
            }
        }
    };

    const onSelectTag = (index) => {
        if (tags.includes(index)) {
            const data= [...tags]
            const ind = data.indexOf(index);
            if (ind > -1) {
                data.splice(ind, 1);
                setTags([...data]);
            }
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
        setTags(tags.filter(tag => tag !== tagName))
    }

    const handleFormatSelected = (val) => {
        setUploadFormat(val);
    }

    const handleUploadClicked = () => {
    switch (uploadFormat) {
        case 'img':
            // Check if there are any videos already selected
            const hasVideoSelected = selectedMedia.some(item => item.type?.includes("video"));
            if (hasVideoSelected) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'You cannot add both images and videos together. Please remove the selected video.',
                });
            } else {
                requestGalleryPermission('photo');
            }
            break;
        case 'video':
            // Check if there are any images already selected
            const hasImageSelected = selectedMedia.some(item => item.type?.includes("image"));
            if (hasImageSelected) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'You cannot add both images and videos together. Please remove the selected images.',
                });
            } else {
                requestGalleryPermission('video');
            }
            break;
        case 'doc':
            handleDocumentUpload();
            break;
        default:
            console.warn('Unsupported upload format:', uploadFormat);
    }
};

    // const handleAddMoreClicked = () => {
    //     requestGalleryPermission();
    // }

    const handleSaveDraftProjectClicked = () => {
        const bodyFormData = new FormData();
        bodyFormData.append("userId", user?._id);
        bodyFormData.append("name", title);
        if(tags.length>0){
            let tagsJson = JSON.stringify(tags);
            bodyFormData.append("tags", tagsJson);
        }
        bodyFormData.append("description", desc);
        bodyFormData.append("link", link);
        bodyFormData.append("isPublished", false);

        let images = [];
        let videos = [];
        let documents = [];

        if(selectedMedia?.length > 0) {
            for(let i=0;i<selectedMedia?.length;i++) {
                if(selectedMedia[i].type?.includes("image")) {
                    images.push(selectedMedia[i])
                }
                if(selectedMedia[i].type?.includes("video")) {
                    videos.push(selectedMedia[i])
                }
                if(selectedMedia[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedMedia[i].type === 'application/pdf' || selectedMedia[i].type === 'application/msword') {
                    documents.push(selectedMedia[i])
                }
            }
        }
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

        addProjectToBoard(bodyFormData);
    }

    const handleNextClicked = () => {
        if(title !== '') {
            if(desc !== '') {
                if(selectedMedia?.length > 0) {
                    let images = [];
                    let videos = [];
                    let documents = [];
                    for(let i=0;i<selectedMedia?.length;i++) {
                        if(selectedMedia[i].type?.includes("image")) {
                            images.push(selectedMedia[i])
                        }
                        if(selectedMedia[i].type?.includes("video")) {
                            videos.push(selectedMedia[i])
                        }
                        if(selectedMedia[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedMedia[i].type === 'application/pdf' || selectedMedia[i].type === 'application/msword') {
                            documents.push(selectedMedia[i])
                        }
                    }
                    navigate('AddProjectStep2', { selectedMedia, title, tags, desc, link:[link], images, videos, documents, uploadFormat });``
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

    const handleDeleteClicked = (name) => {
        setSelectedMedia(selectedMedia.filter(item => item?.fileName !== name));
    }

    const handleDocumentUpload = async() => {
        try {
            const pickerResult = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [types.pdf, types.docx, types.doc],
                copyTo: "documentDirectory",
            });
            setSelectedMedia(pickerResult);
          } catch (error) {
            Toast.show({ type:'error',text1:'Something went wrong in UploadCV or ParseCV'})
          }
    }

    const renderMediaItem = ({ item, index }) => {
        return (
            <View style={{ height: itemWidth, width: itemWidth, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                {/* {item?.lastItem ? */}
                    {/* <TouchableOpacity onPress={handleAddMoreClicked} style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10, borderColor: '#7F8A8E', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 40 }}>+</Text>
                    </TouchableOpacity>
                    : */}
                    <View>
                        {item?.type?.includes("image") && <Image
                            source={{ uri: item?.uri }}
                            style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                        />}
                        {item?.type?.includes("video") && <Video
                            source={{ uri: item?.uri }}
                            pause={true}
                            style={{ height: itemWidth - 10, width: itemWidth - 10, borderRadius: 10 }}
                        />}
                        {item?.type === 'application/pdf' && <View style={{ height: itemWidth-10, width: itemWidth-10, borderRadius:10, padding:10, backgroundColor:'#9767D5', alignItems:'center', justifyContent:'center' }}>
                            <Text style={{ fontSize:18, fontWeight:'700', color:'#FFFFFF' }}>PDF</Text>
                            <Text style={{ fontSize:11, fontWeight:'300', color:'#FFFFFF', textAlign:'center', marginVertical:5 }}>{item?.name}</Text>
                        </View>}
                        {item?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && <View style={{ height: itemWidth-10, width: itemWidth-10, borderRadius:10, padding:10, backgroundColor:'#9767D5', alignItems:'center', justifyContent:'center' }}>
                            <Text style={{ fontSize:18, fontWeight:'700', color:'#FFFFFF' }}>DOCX</Text>
                            <Text style={{ fontSize:11, fontWeight:'300', color:'#FFFFFF', textAlign:'center', marginVertical:5 }}>{item?.name}</Text>
                        </View>}
                        {item?.type === 'application/msword' && <View style={{ height: itemWidth-10, width: itemWidth-10, borderRadius:10, padding:10, backgroundColor:'#9767D5', alignItems:'center', justifyContent:'center' }}>
                            <Text style={{ fontSize:18, fontWeight:'700', color:'#FFFFFF' }}>DOC</Text>
                            <Text style={{ fontSize:11, fontWeight:'300', color:'#FFFFFF', textAlign:'center', marginVertical:5 }}>{item?.name}</Text>
                        </View>}
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
                            <TouchableOpacity onPress={() => handleDeleteClicked(item?.fileName)} style={{ alignItems: 'flex-end', marginRight: 15, marginTop: 10 }}>
                                <View style={{ borderWidth: 1.2, borderColor: '#FFFFFF', height: 20, width: 20, borderRadius: 10 }}></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                {/* } */}
            </View>
        )
    }



    return (
        <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', marginTop:16 }}>
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
                    <TouchableOpacity disabled={title === '' || desc === '' || selectedMedia?.length == 0} onPress={handleSaveDraftProjectClicked} f={1} ai='flex-end' pr={20}>
                        <Text  style={{ fontSize: 14, fontWeight: '500', color: (title === '' || desc === '' || selectedMedia?.length == 0) ? '#AAAAAA' : '#000000' }}>Save Draft</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text>Step 1: Project Details</Text>
                    </View>
                    <ScrollView keyboardDismissMode="on-drag" style={{ marginHorizontal: 20 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                        <FormItem type='text' isRequired value={title} onChange={onChangeTitle} title={'Title'} />
                        <FormItem type='textarea' isRequired value={desc} onChange={onChangeDesc} title={'Description'} />
                        <FormItem type='dropdown' title={'Add Tags about your project (Max 2)'} value={tags} onChange={onSelectTag} removeTag={removeTag} options={tagsArray} onSearch={setSearchTag} searchKey={debouncedSearchTag}/>
                        <FormItem type='text' value={link} onChange={onChangeLink} title={'Add Link'} />
                        <View style={{ marginTop: 20 }}>
                            {selectedMedia?.length > 0 ?
                                <>
                                    <Text>Chosen Media</Text>
                                    <FlatList
                                        data={selectedMedia}
                                        renderItem={renderMediaItem}
                                        numColumns={3}
                                    />
                                    <TouchableOpacity onPress={handleNextClicked} disabled={uploadFormat === ''} style={{ marginTop: 20, backgroundColor: uploadFormat === '' ? '#AAAAAA' : '#000000', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                                        <Text style={{ color: '#FFFFFF' }}>Next</Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                <View fd='row' ai='center'>
                                    <Text>Choose Format</Text>
                                    <View f={1} fd='row'>
                                        <TouchableOpacity f={1} ml={8} onPress={() => handleFormatSelected('img')}>
                                            <Icons.FeedImage width={20} height={20} fill={uploadFormat === 'img' ? '#000' : '#7F8A8E'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity f={1} ml={8} onPress={() => handleFormatSelected('video')}>
                                            <Icons.FeedVideo width={22} height={22} fill={uploadFormat === 'video' ? '#000' : '#7F8A8E'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity f={1} ml={8} onPress={() => handleFormatSelected('doc')}>
                                            <Icons.Document width={20} height={20} fill={uploadFormat === 'doc' ? '#000' : '#7F8A8E'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                    <TouchableOpacity onPress={handleUploadClicked} disabled={uploadFormat === ''} style={{ marginTop: 20, backgroundColor: uploadFormat === '' ? '#AAAAAA' : '#000000', alignItems: 'center', borderRadius: 12, paddingVertical: 22 }}>
                                        <Text style={{ color: '#FFFFFF' }}>Upload</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </MainLayout>
    )
}

export default AddProjectStep1;