import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStatusBar } from '../../hooks/useStatusBar';
import { useIsFocused } from '@react-navigation/native';
import Icons from '../../constants/icons';
import dayjs from 'dayjs';

const Timeslotbooking = ({ route, navigation }) => {
    const [selectedDate, setSelectedDate] = useState(route.params.selectedDate || dayjs().format('YYYY-MM-DD'));
    const [currentDate, setCurrentDate] = useState(dayjs(selectedDate));
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    useStatusBar('#FFF', 'dark-content', isFocused);

    // Define available time slots for specific dates
    const availableTimeSlots = {
        '2024-07-15': ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'],
        '2024-07-16': ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
        '2024-07-17': ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'],
        '2024-07-28': ['03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
    };

    const getAvailableTimeSlots = (date) => {
        return availableTimeSlots[date] || [];
    };

    useEffect(() => {
        setCurrentDate(dayjs(selectedDate));
    }, [selectedDate]);

    const changeDate = (days) => {
        const newDate = currentDate.add(days, 'day');
        setSelectedDate(newDate.format('YYYY-MM-DD'));
    };

    const handleTimeSlotClick = (time) => {
        console.log(`Selected time slot: ${time}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: insets.top, backgroundColor: '#FFF' }} />
            <View style={{ alignItems: 'center', paddingTop: 8, flexDirection: 'row', justifyContent: 'center', marginVertical: 8, paddingBottom: 20 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.pop();
                    }}
                    style={{ position: 'absolute', left: 16 }}
                >
                    {Icons?.BackArrow ? <Icons.BackArrow width={32} height={32} /> : null}
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#404040", paddingTop: 10 }}>Book session</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={{ paddingHorizontal: 16 }}>
                    <Icons.LeftArrow width={24} height={24} /> 
                </TouchableOpacity>
                <View style={{ alignItems: 'center', padding: 16, backgroundColor: '#B9E4A6', borderRadius: 8 }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>{currentDate.format('ddd, MMM DD YYYY')}</Text>
                </View>
                <TouchableOpacity onPress={() => changeDate(1)} style={{ paddingHorizontal: 16 }}>
                    <Icons.RightArrow width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {getAvailableTimeSlots(selectedDate).map((time, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={{ 
                            padding: 16, 
                            marginVertical: 8, 
                            backgroundColor: '#B9E4A6', 
                            borderRadius: 8, 
                            alignItems: 'center' 
                        }}
                        onPress={() => handleTimeSlotClick(time)}
                    >
                        <Text style={{ color: '#FFF', fontSize: 16 }}>{time}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Timeslotbooking;
