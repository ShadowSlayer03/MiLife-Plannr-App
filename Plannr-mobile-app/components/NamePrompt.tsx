import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type NamePromptProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

const NamePrompt = ({ visible, onClose, onSubmit }: NamePromptProps) => {
  const [planName, setPlanName] = useState("");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
          <Text className="text-lg font-bricolage-semibold mb-4 text-gray-800 text-center">
            Enter Plan Name
          </Text>

          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder="My Monthly Plan"
            className="border border-gray-300 rounded-full px-3 py-2 mb-6 text-gray-800 font-kanit"
          />

          <View className="flex-col gap-3">
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-full items-center shadow-md active:opacity-70"
              onPress={onClose}
            >
              <Text className="text-gray-800 font-bricolage-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-mi-purple py-3 rounded-full items-center shadow-md active:opacity-70"
              onPress={() => {
                onSubmit(planName.trim());
                setPlanName("");
                onClose();
              }}
            >
              <Text className="text-white font-bricolage-semibold text-base">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NamePrompt;