import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
          <Text className="text-lg font-bricolage-semibold mb-4 text-gray-800">
            Enter Plan Name
          </Text>

          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder="My Monthly Plan"
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-800 font-kanit"
          />

          <View className="flex-row justify-end">
            <TouchableOpacity
              className="px-4 py-2 mr-2 rounded-lg bg-gray-200"
              onPress={onClose}
            >
              <Text className="text-gray-700 font-bricolage-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-mi-purple"
              onPress={() => {
                onSubmit(planName.trim());
                setPlanName("");
                onClose();
              }}
            >
              <Text className="text-white font-bricolage-semibold">
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
