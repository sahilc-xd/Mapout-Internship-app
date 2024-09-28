import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import { Alert } from "react-native";
// import RazorpayCheckout from "react-native-razorpay";
import { Text } from "../../components";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native-style-shorthand";
import Toast from "react-native-toast-message";
// import { useStripe } from "@stripe/stripe-react-native";

const PaymentOptionsModal = ({
  showModal = false,
  closeModal,
  paymentOptions = [],
}) => {
  // const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } = useStripe();
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState(null);
  const user = useAppSelector(state => state.user);
  const [getPaymentIntent, { data, isSuccess, isError }] = api.useStripePaymentIntentMutation();
  const [loading, setLoading] = useState(false);
  const [confirmPayment, {isSuccess: isConfirmSuccess, data: confirmPaymentData}] = api.useConfirmStripePaymentMutation();

  useEffect(() => {
    if (isError) {
      setLoading(false);
    }
  }, [isError]);

  useEffect(()=>{
    if(isConfirmSuccess){
      if(confirmPaymentData?.status === "succeeded"){
        closeModal();
      }
    }
  },[isConfirmSuccess])

  // useEffect(() => {
  //   if (isSuccess) {
  //     let dayCount = paymentOptions[selectedOption - 1]?.days;
  //     const { clientSecret, ephemeralKey, customer, payment_id } = data;
  //     // const canMakePayment = await initPaymentStripe(clientSecret, ephemeralKey, customer);
  //     initPaymentSheet({
  //       merchantDisplayName: "Example, Inc.",
  //       customerId: customer,
  //       customerEphemeralKeySecret: ephemeralKey,
  //       paymentIntentClientSecret: clientSecret,
  //       returnURL: "https://www.mapout.com",
  //       // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
  //       //methods that complete payment after a delay, like SEPA Debit and Sofort.
  //       // allowsDelayedPaymentMethods: true,
  //       defaultBillingDetails: {
  //         // name: "Shubham Buccha",
  //       },
  //     })
  //       .then(res => {
  //         presentPaymentSheet({ clientSecret: data?.clientSecret })
  //           .then(response => {
  //             confirmPayment({payment_id: payment_id});
  //             // confirmPaymentSheetPayment().then((rees)=>{console.log('rees :>> ', rees);}).catch((errrr)=>{console.log('errrr :>> ', errrr);})
  //             setLoading(false);
  //           })
  //           .catch(() => {
  //             setLoading(false);
  //             console.log("payment failedddd :>> ");
  //           });
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //         console.log("payment failed :>> ");
  //       });
  //   }
  // }, [isSuccess]);

  const handleOptionSelection = id => {
    setSelectedOption(id);
  };

  const handlePayNowClicked = () => {
    setLoading(true);
    getPaymentIntent({
      amount: paymentOptions[selectedOption - 1]?.amount,
      currency: paymentOptions[selectedOption - 1]?.currency,
      user_id: user?.user_id,
      customer_id: user?.customer_id,
      serviceType: "chats",
      numberofDays: paymentOptions[selectedOption - 1]?.days,
    });
  };

  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} onPress={closeModal} style={{ flex: 1 }} />
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            paddingTop: 16,
            paddingHorizontal: 32,
          }}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginBottom: 16 }}
            onPress={closeModal}>
            <Icon name="close" size={18} color={"#000"} />
          </TouchableOpacity>
          <View>
            <Text ftsz={16} weight="500" ta="center">
              Pay and Unlock Chat
            </Text>
            <View mv={16}>
              {paymentOptions.map(option => (
                <TouchableOpacity
                  onPress={() => handleOptionSelection(option?.id)}
                  key={option?.id}
                  style={{
                    backgroundColor:
                      selectedOption === option?.id
                        ? "rgba(185, 228, 166, 0.45)"
                        : "#FFFFFF",
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: "#7F8A8E",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 30,
                    marginVertical: 8,
                  }}>
                  <Text c={"#000"} ftsz={15} weight="600">
                    {option?.currency} {option?.amount / 100}{" "}
                    <Text c={"#000"} ftsz={13} weight="400">
                      {" "}
                      for {option?.days} {option?.days > 1 ? "days*" : "day*"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePayNowClicked}
            style={{
              backgroundColor: "#000000",
              marginBottom: 10,
              alignItems: "center",
              paddingVertical: 20,
              borderRadius: 12,
            }}>
            {loading ? (
              <ActivityIndicator size={"small"} color={"#FFF"} />
            ) : (
              <Text style={{ color: "#FFFFFF" }}>Pay now</Text>
            )}
          </TouchableOpacity>
          <Text ta="right" style={{ fontSize: 10 }}>
            *Terms and Conditions Apply
          </Text>
        </View>
        <View bgc={"#FFF"} h={insets.bottom} />
      </View>
    </Modal>
  );
};

export default PaymentOptionsModal;
