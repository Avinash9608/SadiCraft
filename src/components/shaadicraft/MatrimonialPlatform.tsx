"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AppHeader from './AppHeader';
import BiodataForm from './BiodataForm';
import BiodataPreview from './BiodataPreview';
import { biodataSchema, defaultBiodataValues, type BiodataFormValues } from '@/lib/zod-schemas';
import { useToast } from "@/hooks/use-toast";

const MatrimonialPlatform: React.FC = () => {
    const { toast } = useToast();
    const [isDirty, setIsDirty] = useState(false);

    const form = useForm<BiodataFormValues>({
        resolver: zodResolver(biodataSchema),
        defaultValues: defaultBiodataValues,
    });

    const watchedData = form.watch();

    useEffect(() => {
        const savedData = sessionStorage.getItem('biodataForm');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                form.reset(parsedData);
                setIsDirty(true);
            } catch (error) {
                console.error("Could not parse saved biodata:", error);
            }
        }
    }, [form]);
    
    useEffect(() => {
        const subscription = form.watch(() => {
            setIsDirty(true); 
            sessionStorage.setItem('biodataForm', JSON.stringify(form.getValues()));
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const handleDownloadPdf = async () => {
        const element = document.getElementById('biodata-preview-content');
        if (element) {
             const html2pdf = (await import('html2pdf.js')).default;
             const opt = {
                margin: 0,
                filename: `${form.getValues('fullName') || 'biodata'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(opt).save().catch(err => {
                console.error("PDF generation error:", err);
                toast({
                    variant: 'destructive',
                    title: 'PDF Generation Failed',
                    description: 'There was an error creating the PDF. Please try again.',
                });
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Preview Not Found',
                description: 'Could not find the biodata preview to download.',
            });
        }
    };
    
    return (
        <div className="min-h-screen bg-background">
            <AppHeader form={form} onDownloadPdf={handleDownloadPdf} />
            <main className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 px-4">
                <div className="lg:col-span-1">
                    <BiodataForm form={form} />
                </div>
                <div className="lg:col-span-1 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto">
                   <BiodataPreview data={watchedData} isDirty={isDirty} />
                </div>
            </main>
        </div>
    );
};

export default MatrimonialPlatform;
