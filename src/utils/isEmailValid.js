export const isEmailValid = email => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const isOTPValid = (otp, type) =>{
  let otpRegex = /^\d{6}$/;
  if(type == "email"){
    otpRegex = /^\d{6}$/;
  }
  return otpRegex.test(otp);
}

export const isDateValid = (date)=>{
  var pattern =/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
  return pattern.test(date);
}

export const isDateValidMY = (date)=>{
  var pattern =/^([0-9]{1,2})\/([0-9]{4})$/;
  return pattern.test(date);
}

export const isValidURL = (url)=>{
  const pattern = /^(?:(http|https):\/\/)?(?:www\.)?([^\s:@]+)(:\d+)?(\/[^\s?#*]*?)?(\?[^#]*)?(#\S*)?$/;
  return pattern.test(url);
}
