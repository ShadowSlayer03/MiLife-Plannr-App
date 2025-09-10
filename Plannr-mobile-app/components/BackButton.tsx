import React from 'react'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, TouchableOpacity } from 'react-native'

type BackButtonProps = {
    xPos?: string;
    yPos?: string
}

const BackButton = ({ xPos = "left-4", yPos = "top-10" }: BackButtonProps) => {
    const router = useRouter();

    const handlePressBackArrow = () => {
        if (router.canGoBack())
            router.back();
        else
            router.push("/budget-setup/instructions");
    }

    return (
        <View>
            <TouchableOpacity
                onPress={handlePressBackArrow}
                className={`absolute ${yPos} ${xPos} z-10 p-2`}
            >
                <Ionicons name="return-up-back" size={26} color="#602c66" />
            </TouchableOpacity>
        </View>
    )
}

export default BackButton