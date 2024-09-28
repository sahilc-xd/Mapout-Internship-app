import { Alert } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';

export const TakePayment = ({amount, order_id, email, phone, name})=>{
    console.log(amount, order_id, email, phone, name);
    var options = {
        description: 'Credits towards coaching',
        image: 'https://i.imgur.com/3g7nmJC.jpg',
        currency: 'INR',
        key: 'rzp_test_VPMIKsKefsWs8W',
        amount: amount,
        name: 'MapOut',
        order_id: order_id,//Replace this with an order_id created using Orders API.
        prefill: {
          email: email,
          contact: phone,
          name: name
        },
        theme: {color: '#000'}
      }
      // RazorpayCheckout.open(options).then((data) => {
      //   // handle success
      //   Alert.alert(`Success: ${data.razorpay_payment_id}`);
      // }).catch((error) => {
      //   // handle failure
      //   Alert.alert(`Error: ${error.code} | ${error.description}`);
      // });
}