'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
    email: string;
    nome: string;
    sobrenome: string;
    telefone: string;
    address: string; // <--- adicionado
}

interface FormContextType {
    checkFormData: FormData;
    checkUpdateFormData: (field: keyof FormData, value: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [checkFormData, setCheckFormData] = useState<FormData>({
        email: '',
        nome: '',
        sobrenome: '',
        telefone: '',
        address: '',
    });

    const checkUpdateFormData = (field: keyof FormData, value: string) => {
        setCheckFormData((prev) => ({ ...prev, [field]: value }));
    };

    return <FormContext.Provider value={{ checkFormData, checkUpdateFormData }}>{children}</FormContext.Provider>;
};

export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error('useForm must be used within a FormProvider');
    return context;
};
