import { supabase } from "./supabase";

const translateWithEdgeFunc = async () => {
    const { data, error } = await supabase.functions.invoke('translate', {
        body: {
            objectToTranslate: {
                name: 'Aidan Welch',
                fact: "I'm maintaining this project",
                birthMonth: 'February',
            },
            fromLang: 'en',
            toLang: 'ja',
        },
    });

    if (error) {
        console.error('Function error:', error);
        return;
    }

    console.log('Translated data:', data);
}

export default translateWithEdgeFunc;