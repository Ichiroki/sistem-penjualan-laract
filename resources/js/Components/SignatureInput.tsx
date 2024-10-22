// SignatureInput.js
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureInput = ({ onSave, onClear }) => {
    const sigCanvas = useRef<SignatureCanvas | null>(null);

    const clearSignature = () => {
        sigCanvas.current?.clear();
        if (onClear) onClear();
    };

    const saveSignature = () => {
        const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        if (onSave) onSave(signatureData);
    };

    return (
        <div className="my-4">
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: 'border w-full h-40 rounded-md shadow-md' }}
            />
            <div className="flex gap-3 mt-2">
                <button
                    type="button"
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={clearSignature}
                >
                    Clear
                </button>
                <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={saveSignature}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SignatureInput;
