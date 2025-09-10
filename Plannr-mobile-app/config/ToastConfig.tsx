import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#602c66", // bg-mi-purple
        borderLeftWidth: 0,
        borderRadius: 12,
        width: "90%",
        alignSelf: "center",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        fontFamily: "kanit-semibold"
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: 300,
        textAlign: "center",
        fontFamily: "kanit"
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "#dc2626",
        borderLeftWidth: 0,
        borderRadius: 12,
        width: "90%",
        alignSelf: "center",
      }}
      text1Style={{
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        fontFamily: "kanit-semibold"
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: 300,
        textAlign: "center",
        fontFamily: "kanit"
      }}
    />
  ),
};

export default toastConfig;
