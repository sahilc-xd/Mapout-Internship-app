import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStatusBar } from '../../hooks/useStatusBar';
import { useIsFocused } from '@react-navigation/native';
import Icons from '../../constants/icons';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import dayjs from 'dayjs';

const Booking_page = () => {
    const navigation = useNavigation(); // Initialize navigation hook
    const [selectedDate, setSelectedDate] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    useStatusBar('#FFF', 'dark-content', isFocused);

    // Hardcoded booking data
    const bookingData = {
        "status": true,
        "data": {
            "bookingSlots": [
                {
                    "start": "2024-07-15T03:30:00.000Z",
                    "end": "2024-07-15T04:15:00.000Z",
                    "state": "available",
                    "booked": true
                },
                {
                    "start": "2024-07-16T03:30:00.000Z",
                    "end": "2024-07-16T04:15:00.000Z",
                    "state": "available",
                    "booked": true
                },
                {
                    "start": "2024-07-17T03:30:00.000Z",
                    "end": "2024-07-17T04:15:00.000Z",
                    "state": "available",
                    "booked": true
                },
                {
                    "start": "2024-07-19T03:30:00.000Z",
                    "end": "2024-07-19T04:15:00.000Z",
                    "state": "available",
                    "booked": true
                },
                // Other booking slots...
            ]
        }
    };

    const availableDates = bookingData.data.bookingSlots
        .filter(slot => slot.booked === true)
        .map(slot => slot.start.split('T')[0]);

    const onDayPress = (day) => {
        if (availableDates.includes(day.dateString)) {
            setSelectedDate(day.dateString);
            console.log('Selected date: ', day.dateString);
            navigation.navigate('Timeslotbooking', { selectedDate: day.dateString }); // Pass selected date as route parameter
        }
    };

    const renderCustomHeader = (date) => {
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const previousMonth = new Date(date);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        const previousMonthString = previousMonth.toLocaleString('default', { month: 'long' });

        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthString = nextMonth.toLocaleString('default', { month: 'long' });

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setCurrentDate(previousMonth)} style={{ marginRight: 50 }}>
                    <Text style={{ fontSize: 14, color: '#555', textAlign: 'center' }}>{previousMonthString}</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center', marginBottom: 25 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#000', textAlign: 'center' }}>{month}</Text>
                    <Text style={{ fontSize: 12, color: '#555', fontWeight: '500', textAlign: 'center' }}>{year}</Text>
                </View>
                <TouchableOpacity onPress={() => setCurrentDate(nextMonth)} style={{ marginLeft: 50 }}>
                    <Text style={{ fontSize: 14, color: '#555', textAlign: 'right' }}>{nextMonthString}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleCCSessionClicked = () => {
        // Handle session booking click
        console.log('Book 1-1 session clicked');
    };

    const dayComponent = ({ date, state }) => {
        const isSelected = date.dateString === selectedDate;
        const isAvailable = availableDates.includes(date.dateString);
        const borderColor = isSelected ? '#B9E4A6' : (isAvailable ? '#B9E4A6' : '#FFF');
        const textColor = state === 'disabled' || !isAvailable ? '#d9e1e8' : '#2d4150';

        return (
            <TouchableOpacity onPress={() => onDayPress(date)} disabled={!isAvailable}>
                <View style={{
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 16,
                    margin: -5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 45,
                    height: 45,
                    backgroundColor: isSelected ? '#B9E4A6' : '#FFF'
                }}>
                    <Text style={{ color: textColor, fontSize: 14 }}>{date.day}</Text>
                </View>
            </TouchableOpacity>
        );
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
                    <Icons.BackArrow width={32} height={32} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#404040", paddingTop: 10 }}>Book session</Text>
            </View>
            <Calendar
                current={currentDate}
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#B9E4A6' },
                }}
                theme={{
                    todayTextColor: '#000',
                    arrowColor: '#000',
                }}
                renderHeader={(date) => renderCustomHeader(new Date(date))}
                dayComponent={dayComponent}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, paddingHorizontal: 16, paddingBottom: 16 }}>
                <TouchableOpacity
                    onPress={handleCCSessionClicked}
                    disabled={!selectedDate}
                    style={{
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 12,
                        backgroundColor: selectedDate ? "#000" : "#ccc",
                        flex: 1,
                    }}>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: selectedDate ? "#FFF" : "#888" }}>
                        Book 1-1 session
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Booking_page;
