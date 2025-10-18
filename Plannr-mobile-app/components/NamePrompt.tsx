import { NamePromptContent } from "@/constants/Content";
import { useTranslatePage } from "@/hooks/useTranslatePage";
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
  const { translated, translating } = useTranslatePage(NamePromptContent)

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
            {translated.title}
          </Text>

          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder={translated.planNamePlaceholder}
            className="border border-gray-300 rounded-full px-3 py-2 mb-6 text-gray-800 font-kanit"
          />

          <View className="flex-col gap-3">
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-full items-center shadow-md active:opacity-70"
              onPress={onClose}
            >
              <Text className="text-gray-800 font-bricolage-semibold text-base">
                {translated.cancelButtonText}
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
                {translated.saveButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NamePrompt;