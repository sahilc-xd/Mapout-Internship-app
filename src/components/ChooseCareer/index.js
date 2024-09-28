import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native-style-shorthand';
import { SearchInput, Text } from '..';
import LinearGradient from 'react-native-linear-gradient';
import usePagination from '../../hooks/usePagination';
import { api } from '../../redux/api';
import useDebounce from '../../hooks/useDebounce';
import { useAppSelector } from '../../redux';

const ChooseCareer =(props)=>{
    const fromScreen =  props?.screen || false;
    const user = useAppSelector(state => state.user);
    const [requestToAddOption, { isLoading: isRequestToAddLoading, isSuccess: isRequestToAddSuccess, reset, isError: requestToAddError  }] = api.useRequestToAddDataMutation();
    const [searchRole, setSearchRole] = useState("");
    const debouncedSearchRole = useDebounce(searchRole, 300);
    const [roleDataList, setRoleDataList] = useState([]);
    const {data: roleList, page: roleListPage, onReachedEnd: onReachedRoleEnd, loadingMoreData: loadMoreRoleData} = usePagination(debouncedSearchRole, roleDataList);
    const  {data: roleData} = api.useGetEducationWorkDetailsQuery({search: debouncedSearchRole, type:"job_titles",  page: roleListPage});
    const [role, setRole] = useState('');
    const [saveRole, { isLoading: isLoadingCareer, isError: isErrorCareer, isSuccess: isSuccessCareer }] = api.useSaveEducationWorkDetailsMutation();

    useEffect(()=>{
        if(roleData?.data?.length>0){
          setRoleDataList([...roleData?.data])
        }
        else{
          setRoleDataList([])
        }
      },[roleData])

    useEffect(()=>{
        if(role){
            let work_details = {
                role: role,
            };
            if (user?.workDetails?.[0]?._id) {
                work_details = {
                    ...user?.workDetails?.[0],
                    role: role,
                };
            }
        
            saveRole({
                user_id: user.user_id,
                work_details: [work_details],
            });
        }
    },[role])

    const onSearch = (text) => {
        if (isRequestToAddSuccess || requestToAddError) {
            reset();
          }
        setSearchRole(text);
      };

    const onPressAdd = async (searchString) => {
    if (isRequestToAddLoading || !searchString) {return;}
    await requestToAddOption({
        type: type,
        newData: searchString,
        user_id: user?.user_id,
    });
    };


    return(
        <View>
            <LinearGradient colors={["#5980FF", "#A968FD"]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} useAngle={true} angle={135} angleCenter={{x:0.5,y:0.5}} style={{borderRadius: 8, paddingVertical: 16, paddingHorizontal: 16}}>
                <Text mb={32} weight='500' ftsz={14} c={'#FFF'}>
                    {fromScreen === 'Jobs' ? `Choose a career to start your personalized job exploration on:` :`Choose a career to start your daily personalised coaching on:`}
                </Text>
                {isLoadingCareer ? <View ai='center'><ActivityIndicator color={'#FFF'}/></View> : <SearchInput
                    searchIconColor = {'#FFF'}
                    inputStyle={{backgroundColor : 'transparent', borderColor:'#FFF'}}
                    valueColor={'#FFF'}
                    labelStyle={{color: '#FFF', paddingLeft: 4, paddingRight:4}}
                    onReachEnd = {onReachedRoleEnd}
                    onReachEndThreshold = {0.5}
                    loadingMoreData={loadMoreRoleData}
                    value={role}
                    label="Career*"
                    placeholder="Search"
                    onSearch={onSearch}
                    onSelect={setRole}
                    options={[...roleList?.map(val=>val.name)]}
                    requestToAddOption={{
                        buttonLabel: "Request to Add",
                        successText: "While we are reviewing this, you can fill other work details",
                        title: "This sounds like a unique role that doesn't exist with us currently.",
                        isLoading: isRequestToAddLoading,
                        isSuccess: isRequestToAddSuccess,
                        onPressAdd: onPressAdd,
                    }}
                />}
            </LinearGradient>
        </View>
    )
}

export default ChooseCareer;