'use client'
import { useEffect } from "react"
declare global {
    interface Window {
        atoptions: any;
    }
}

interface AdBannerProps {
    adKey: string;
    height: number;
    width: number;
}

export default function AdBanner({
    adKey,
    height,
    width
}: AdBannerProps) {

    useEffect(() => {
        window.atoptions = {
            'key': adKey,
            'format': 'iframe',
            'height': height,
            'width': width,
            'params': {}
        };

        const script= document.createElement('script');
        script.src = `//www.higherformanceformat.com/${adKey}/invoke.js`;
        script.async = true;
        document.getElementById(`ad-${adKey}`)?.appendChild(script);
    }, [adKey,height,width]);

    return (
        <div
        id={`ad-${adKey}`}
        className="flex justify-center my-4"
        style={{minHeight: height}}
        />  
    );
}