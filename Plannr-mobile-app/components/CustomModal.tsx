import { Modal, Text, TouchableOpacity, View } from "react-native";

type ModalButton = {
  label: string;
  onPress: () => void;
  bgColor?: string;       // Optional button background
  textColor?: string;     // Optional text color
};

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttons?: ModalButton[];
};

const CustomModal = ({
  visible,
  onClose,
  title = "Modal Title",
  description = "",
  buttons = [],
}: CustomModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-2xl p-6 w-80 shadow-lg">
          {/* ❌ Close */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-1 right-3"
          >
            <Text className="text-md font-bricolage-semibold text-gray-500">✕</Text>
          </TouchableOpacity>

          {/* Title & Description */}
          <Text className="text-lg mb-2 font-bricolage-bold text-center">{title}</Text>
          {description ? (
            <Text className="mb-6 font-kanit text-gray-600 text-center">{description}</Text>
          ) : null}

          {/* Buttons */}
          <View className="flex-col gap-3">
            {buttons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  onClose();
                  btn.onPress();
                }}
                className={`py-3 rounded-full items-center shadow-md active:opacity-70 ${btn.bgColor || "bg-mi-purple"}`}
              >
                <Text
                  className={`font-bricolage-semibold text-base ${btn.textColor || "text-white"}`}
                >
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;